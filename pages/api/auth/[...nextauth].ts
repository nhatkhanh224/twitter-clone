import fetcher from "@/libs/fetcher";
import UserService from "@/services/UserService";
import axios from "axios";
import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }
        const user = await axios.post('http://localhost:3000/users',{
          "email": credentials?.email
      })
        .then(function (response) {
          return response.data
        })
        .catch(function (error) {
          console.log(error);
        });

        if (!user || !user?.password) {
          throw new Error('Invalid credentials');
        }
        return user;
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
