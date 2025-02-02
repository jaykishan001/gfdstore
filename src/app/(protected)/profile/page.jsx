import Container from "@/components/Container"
import { ProfileContent } from "@/components/ProfileComponent"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"


const ProfilePage = () => {
  return (
    <Container className="mt-20">
      <SidebarProvider>
        <SidebarInset>
          <main className="min-h-screen bg-background">
            <div className="flex items-center border-b px-4 py-4 md:px-6">
              <h1 className="text-lg font-semibold md:text-2xl">My Profile</h1>
            </div>
            <ProfileContent />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Container>
  )
}

export default ProfilePage

