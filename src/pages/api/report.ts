import { NextApiRequest, NextApiResponse } from 'next';
import { generateReport } from '../../lib/pdf/buildReport';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stream = await generateReport();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=rentfax-report.pdf');

    stream.pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF');
  }
}