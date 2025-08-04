import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real application, you would validate the webhook source (e.g., using a secret key)
    // and process the data accordingly.
    
    console.log('Webhook received:', body);
    
    // Example: Process a new property listing
    if (body.event === 'property.listed') {
      const { propertyId, address, rent } = body.data;
      console.log(`Processing new property listing ${propertyId} at ${address} for $${rent}/month.`);
      // ...trigger internal workflows, update database, etc.
    }
    
    // Example: Process a tenant application
    if (body.event === 'application.submitted') {
      const { applicationId, applicantName } = body.data;
      console.log(`Processing new application ${applicationId} from ${applicantName}.`);
       // ...initiate background check via Rentfax services
    }

    return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// To test this endpoint, you can use a tool like curl:
// curl -X POST http://localhost:9002/api/webhooks/property-management \
// -H "Content-Type: application/json" \
// -d '{"event": "property.listed", "data": {"propertyId": "p123", "address": "456 Oak Ave", "rent": 2200}}'
