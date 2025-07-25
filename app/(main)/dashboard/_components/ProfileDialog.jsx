import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Credits from './Credits'
  

function ProfileDialog({children}) {
  return (
    <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent>
    <DialogHeader>
    <DialogTitle></DialogTitle>
  <Credits />
</DialogHeader>

    </DialogContent>
  </Dialog>
  
  )
}

export default ProfileDialog