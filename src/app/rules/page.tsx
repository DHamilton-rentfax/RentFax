import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Ban, Clock, AlertTriangle, Scale, UserX, FileText } from 'lucide-react';

const rules = [
  {
    icon: <UserX className="w-8 h-8 text-primary" />,
    title: 'Unauthorized Driver',
    description:
      'Unauthorized driving is a contract breach. The rental may be terminated, and an incident will be logged for both the primary renter and the unauthorized driver when identifiable.',
  },
  {
    icon: <Ban className="w-8 h-8 text-primary" />,
    title: 'Smoking/Odor',
    description:
      'A cleaning fee will be assessed for smoking or strong odors. A biohazard fee may apply in severe cases.',
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: 'Late Return',
    description:
      'Vehicles returned after the agreed-upon time will be subject to the daily rental rate plus applicable late fees after the grace period.',
  },
  {
    icon: <AlertTriangle className="w-8 h-8 text-primary" />,
    title: 'Damage/Accident',
    description:
      'Renters must provide immediate notice of any damage or accident, cooperate with insurance providers, and submit all required evidence.',
  },
  {
    icon: <Scale className="w-8 h-8 text-primary" />,
    title: 'Non-Payment/Chargeback',
    description:
      'Failure to pay or initiating a chargeback will result in collections activity and will be visible on the RentFAX network, which may affect future rental eligibility.',
  },
    {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: 'Disputes',
    description:
        'Disputes must be submitted within 30 days of the incident report. Decisions will be based on the evidence and rationale provided. A single appeal may be permitted.',
    },
];

export default function RulesPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Protected by RentFAX
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            We partner with rental companies to promote a safe and transparent
            community. The following rules are enforced to protect all parties.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rules.map((rule) => (
                <Card key={rule.title} className="shadow-lg border-none">
                    <CardHeader className="flex flex-row items-center gap-4">
                        {rule.icon}
                        <CardTitle className="font-headline text-xl">{rule.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{rule.description}</p>
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
