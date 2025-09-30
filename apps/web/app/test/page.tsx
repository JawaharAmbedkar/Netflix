import prisma from "packages/db/client"

export default async function TestPage() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: 'hashedpassword',  // For test only
        name: 'Test User',
        membershipRecord: {
          create: {
            amount: 1000,
            status: false,
          },
        },
      },
    })

    return (
      <div>
        <h1>User created successfully!</h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    )
  } catch (error) {
    return (
      <div>
        <h1>Error creating user</h1>
        <pre>{String(error)}</pre>
      </div>
    )
  } finally {
    await prisma.$disconnect()
  }
}
