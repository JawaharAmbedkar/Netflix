import prisma from "@repo/db/client"

async function testCreateUser() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: 'hashedpassword',  // For test only, no need to hash here
        name: 'Test User',
        membershipRecord: {
          create: {
            amount: 1000,
            status: false,
          },
        },
      },
    })
    console.log('Created user with membership:', user)
  } catch (error) {
    console.error('Error creating user with membership:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCreateUser()
