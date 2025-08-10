import Link from "next/link"
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Image from "next/image";

const renters = [
    {
        name: "Liam Johnson",
        email: "liam@example.com",
        riskScore: "85",
        totalIncidents: 3,
        lastRental: "2023-06-23",
        amount: "$250.00",
        imageUrl: "https://placehold.co/64x64.png",
        status: "High Risk",
    },
    {
        name: "Olivia Smith",
        email: "olivia@example.com",
        riskScore: "32",
        totalIncidents: 0,
        lastRental: "2023-06-24",
        amount: "$150.00",
        imageUrl: "https://placehold.co/64x64.png",
        status: "Good Standing",
    },
    {
        name: "Noah Williams",
        email: "noah@example.com",
        riskScore: "15",
        totalIncidents: 0,
        lastRental: "2023-06-25",
        amount: "$350.00",
        imageUrl: "https://placehold.co/64x64.png",
        status: "Good Standing",
    },
    {
        name: "Emma Brown",
        email: "emma@example.com",
        riskScore: "92",
        totalIncidents: 4,
        lastRental: "2023-06-26",
        amount: "$450.00",
        imageUrl: "https://placehold.co/64x64.png",
        status: "High Risk",
    },
    {
        name: "James Jones",
        email: "james@example.com",
        riskScore: "78",
        totalIncidents: 2,
        lastRental: "2023-06-27",
        amount: "$550.00",
        imageUrl: "https://placehold.co/64x64.png",
        status: "High Risk",
    },
     {
        name: "Ava Davis",
        email: "ava@example.com",
        riskScore: "25",
        totalIncidents: 1,
        lastRental: "2023-06-28",
        amount: "$120.00",
        imageUrl: "https://placehold.co/64x64.png",
        status: "Good Standing",
    }
]

export default function RentersPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="high-risk">High Risk</TabsTrigger>
          <TabsTrigger value="good-standing">Good Standing</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Archived
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-rap">
              Add Renter
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Renters</CardTitle>
            <CardDescription>
              Manage your renters and view their risk profiles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Total Incidents
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Rental
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renters.map((renter) => (
                    <TableRow key={renter.email}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                        alt="Renter image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={renter.imageUrl}
                        width="64"
                        data-ai-hint="person"
                        />
                    </TableCell>
                    <TableCell className="font-medium">
                        <div>{renter.name}</div>
                        <div className="text-sm text-muted-foreground">{renter.email}</div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={parseInt(renter.riskScore) > 50 ? 'destructive' : 'default'}>{renter.riskScore}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {renter.totalIncidents}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {renter.lastRental}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Add Incident</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-6</strong> of <strong>{renters.length}</strong>{" "}
              renters
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
