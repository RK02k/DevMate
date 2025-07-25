import React, { useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { CoachingExpert } from '@/services/Options'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { LoaderCircle } from 'lucide-react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/app/_context/UserContext'

function UserInputDialog({ children, coachingOption }) {
  const [selectedExpert, setSelectedExpert] = useState()
  const [topic, setTopic] = useState()
  const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()
  const { userData } = useContext(UserContext)

  const OnClickNext = async () => {
    setLoading(true)
    const result = await createDiscussionRoom({
      topic: topic,
      coachingOption: coachingOption?.name,
      expertName: selectedExpert,
      uid: userData?._id,
    })
    console.log(result)
    setLoading(false)
    setOpenDialog(false)
    router.push('/discussion-room/' + result)
  }
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coachingOption.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3">
              <h2 className="text-black">
                Enter a topic to master your skills in {coachingOption.name}
              </h2>
              <Textarea
                placeholder="Enter your topic here..."
                className="mt-2"
                onChange={(e) => setTopic(e.target.value)}
              ></Textarea>
              <h2 className="text-black mt-5">Select your coaching expert</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
                {CoachingExpert.map((expert, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedExpert(expert.name)}
                  >
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      width={100}
                      height={100}
                      className={`rounded-2xl h-[80px] w-[80px] object-cover hover:scale-105 transition-all cursor-pointer p-1 border-primary ${selectedExpert == expert.name && 'border'}`}
                    />
                    <h2 className="text-center">{expert.name}</h2>
                  </div>
                ))}
              </div>
              <div className="flex gap-5 justify-end mt-5">
                <DialogClose asChild>
                  <Button variant={'ghost'}>Cancel</Button>
                </DialogClose>
                {/* <Button disabled={(!topic || !selectedExpert)} onClick={OnClickNext} {loading &&<LoaderCircle className='animate-spin'/>}>Next</Button> */}
                <Button
                  disabled={!topic || !selectedExpert || loading}
                  onClick={OnClickNext}
                >
                  {loading ? <LoaderCircle className="animate-spin" /> : null}
                  Next
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default UserInputDialog
