import { firestoreSeed } from '../utils/seed'

export default async () => {
  await firestoreSeed() // Create mock users, plans, reports
}
