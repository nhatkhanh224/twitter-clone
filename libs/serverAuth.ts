import { NextApiRequest, NextApiResponse } from 'next';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import axios from 'axios';

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    throw new Error('Not signed in');
  }

  const currentUser = await axios.post(`${process.env.apiURL}/users`, {
    "email": session?.user?.email
  })
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error);
    });

  if (!currentUser) {
    throw new Error('Not signed in');
  }

  return { currentUser };
};

export default serverAuth;
