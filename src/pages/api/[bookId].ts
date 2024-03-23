import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';
//import "../../app/global.css";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bookId } = req.query;
  const session = await getServerSession(req, res, authOptions);
  console.log('Requested bookId:', bookId);

  if(!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // need to check if user is admin as well so he is able to see the content not sure how to implement yet.

  const userEmail = session.user?.email;

  if(!userEmail) {
    return res.status(401).json({ message: 'Unauthorized' });
  }


  if (req.method === 'GET') {
    try {
      const book = await prisma.book.findFirst({
        where: {
          id: parseInt(bookId as string, 10),
          userEmail: userEmail,
        },
        include: {
          paragraphs: {
            orderBy: { paragraphNumber: 'asc' },
            include: {
              image: true,
            },
          },
        },
      });

      console.log('Retrieved book from database:', book);


      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const bookData = {
        id: book.id,
        title: book.title,
        paragraphs: book.paragraphs.map((paragraphs) => ({
          id: paragraphs.id,
          paragraph: paragraphs.paragraph,
          image: paragraphs.image?.image,
        })),
      };
      console.log('Book data:', bookData);

      return res.status(200).json(bookData);
    } catch (error) {
      console.error('Error fetching book:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
