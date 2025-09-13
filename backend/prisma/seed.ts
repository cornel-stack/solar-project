import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const deviceCatalog = [
  { name: 'LED Light Bulb', category: 'lighting', powerConsumption: 10, icon: '💡', description: 'Energy efficient LED bulb' },
  { name: 'Phone Charger', category: 'electronics', powerConsumption: 5, icon: '📱', description: 'Mobile phone charger' },
  { name: 'Radio', category: 'electronics', powerConsumption: 15, icon: '📻', description: 'AM/FM radio receiver' },
  { name: 'TV', category: 'electronics', powerConsumption: 100, icon: '📺', description: 'LCD/LED television' },
  { name: 'Laptop', category: 'electronics', powerConsumption: 65, icon: '💻', description: 'Laptop computer' },
  { name: 'Refrigerator', category: 'appliances', powerConsumption: 150, icon: '🧊', description: 'Energy efficient refrigerator' },
  { name: 'Fan', category: 'appliances', powerConsumption: 75, icon: '🌀', description: 'Ceiling or table fan' },
  { name: 'Water Pump', category: 'industrial', powerConsumption: 500, icon: '💧', description: 'Water pumping system' },
  { name: 'Washing Machine', category: 'appliances', powerConsumption: 400, icon: '👕', description: 'Automatic washing machine' },
  { name: 'Air Conditioner', category: 'appliances', powerConsumption: 1200, icon: '❄️', description: 'Split AC unit' },
  { name: 'Microwave', category: 'appliances', powerConsumption: 800, icon: '📦', description: 'Microwave oven' },
  { name: 'Electric Iron', category: 'appliances', powerConsumption: 1000, icon: '👔', description: 'Electric clothes iron' },
]

async function main() {
  console.log('🌱 Start seeding...')

  // Seed device catalog
  console.log('Seeding device catalog...')
  for (const device of deviceCatalog) {
    await prisma.deviceCatalog.upsert({
      where: { name: device.name },
      update: device,
      create: device,
    })
  }

  console.log('✅ Device catalog seeded')
  console.log('🌱 Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })