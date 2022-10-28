import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "../../../lib/apollo";
import { gql } from "@apollo/client";

const userFields = [
  "accessToken",
  "userId",
  "username",
  "firstName",
  "lastName",
  "email",
  "token_exp",
  "refresh_token",
];
const LOGIN_ERRORS = {
  INVALID_USERNAME: "invalid_username",
  INCORRECT_PASSWORD: "incorrect_password",
  INVALID_EMAIL: "invalid_email",
};

function createUserObj(response) {
  console.log("rajsh", response);
  return {
    userId: response.databaseId,
    username: response.username,
    accessToken: response.jwtAuthToken,
    firstName: response.firstName,
    lastName: response.lastName,
    email: response.email,
    token_exp: response.jwtAuthExpiration,
    refresh_token: response.jwtRefreshToken,
  };
}
function populateObj(obj, source) {
  let newObj = { ...obj };
  for (let field in source) {
    if (!userFields.includes(field)) {
      continue;
    }

    newObj[field] = source[field];
  }

  return newObj;
}
const registerUser = async (email, password, firstName, lastName, userName) => {
  const REGISTER_USER = gql`
    mutation LOGIN_USER_WP(
      $email: String!
      $userName: String!
      $password: String!
      $firstName: String
      $lastName: String
    ) {
      registerUser(
        input: {
          email: $email
          username: $userName
          password: $password
          firstName: $firstName
          lastName: $lastName
          clientMutationId: "RegisterUser"
        }
      ) {
        user {
          databaseId
          email
          jwtAuthToken
          jwtUserSecret
          username
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: REGISTER_USER,
    variables: {
      email,
      password,
      firstName,
      lastName,
      userName,
    },
  });

  return response?.data?.registerUser?.user;
};

async function loginUser(userName, password) {
  const LOGIN_USER = gql`
    mutation LOGIN_USER_WP($userName: String!, $password: String!) {
      login(
        input: {
          username: $userName
          password: $password
          clientMutationId: "LoginUser"
        }
      ) {
        user {
          databaseId
          username
          firstName
          lastName
          email
          jwtAuthToken
          jwtAuthExpiration
          jwtRefreshToken
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: LOGIN_USER,
    variables: {
      userName,
      password,
    },
  });

  return response?.data?.login?.user;
}
const authOptions = {
  session: {
    strategt: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "wpRegister",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const { email, password, firstName, lastName, userName } = credentials;

        try {
          let response = await registerUser(
            email,
            password,
            firstName,
            lastName,
            userName
          );

          return createUserObj(response);
        } catch (error) {
          console.log(error);

          throw new Error(error);
        }
      },
    }),

    CredentialsProvider({
      id: "wpLogin",
      name: "Login",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { userName, password } = credentials;
        const response = await loginUser(userName, password);
        console.log("rajesh", response);
        let errorMessage;
        if (response.error) {
          switch (response.errorMessage) {
            case LOGIN_ERRORS.INVALID_USERNAME:
              errorMessage = "Username does not exists in our records.";
              break;
            case LOGIN_ERRORS.INCORRECT_PASSWORD:
              errorMessage = "Incorrect password.";
              break;
            case LOGIN_ERRORS.INVALID_EMAIL:
              errorMessage = "Email address does not exists in our records.";
              break;
            default:
              errorMessage = "Error occured during login. Please try again.";
              break;
          }
          throw new Error(errorMessage);
        }

        return createUserObj(response);
      },
    }),
  ],
  pages: {
    signIn: "/register",
  },
  jwt: {
    secret: "ereteuiuydig21378hjdh",
  },
  callbacks: {
    async jwt({ token, user }) {
      const token_exp = parseInt(token?.token_exp, 10);

      // Get seconds elapsed.
      const date_now = Date.now() / 1000;

      if (Number.isInteger(token_exp) && date_now > token_exp) {
        const refreshToken = token?.refresh_token;

        if (!refreshToken) {
          return {};
        }

        // Attempt to get a new token using refresh token.
        const new_auth_token = await refreshAuthToken(refreshToken);

        // Possibly return to login?
        if (new_auth_token.error) {
          return {};
        }

        // Update the access token in session.
        token.accessToken = new_auth_token;
      }

      return populateObj(token, user);
    },
    async session({ session, token }) {
      session.user = populateObj(session.user, token);

      return session;
    },
    async redirect({ url }) {
      return url;
    },
  },
};

export default NextAuth(authOptions);
