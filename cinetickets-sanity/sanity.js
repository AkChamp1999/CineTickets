import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'u29enups',
  dataset: 'production',
  useCdn: true,
  token:
    'skARgZtjH78FPXijGrBdOw5QYHr13Mkgnxo6cyi55NGHUEyAykOf8TdRirgunFpB69nOOwXquYO5rfAxxCEwNc4ZchVm19R3KOOhY9C6x8LfibCYThNoLzTefj41ClhcBJn7Z8I4zPqMghCFyw0CMe52DiGGKQruXvbNVjCRPBhS1VABDT1v',
})
