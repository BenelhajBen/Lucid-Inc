import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';



// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const session = await getServerSession(req, res, authOptions);
//     const userEmail = session?.user?.email;

//     if (!userEmail) {
//       return res.status(401).json({ error: 'User not authenticated' });
//     }

//     const { bookId } = req.body;
//     try {

//       const bookmark = await prisma.bookmark.create({
//         data: {
//           book: {
//             connect: {
//               id: bookId,
//             },
//           },
//           user: {
//             connect: {
//               email: userEmail,
//             },
//           },
//         },
//       });

//       res.status(201).json(bookmark);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }


export async function POST(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions);
  const userEmail = session?.user?.email;


  if (!userEmail) {
    return res.status(401).json({ error: 'User not authenticated' });
  }


  // this will be create just boiler plate for now for finding book marks for a specific user

  try {
    const bookmark = await prisma.bookmark.findMany({
      where: {
        user: {
          email: userEmail,
        },
      },
      include: {
        book: true,
      },
    });

    res.status(201).json(bookmark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}