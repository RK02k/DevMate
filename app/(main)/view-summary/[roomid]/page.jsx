// "use client";
// import { useQuery } from 'convex/react';
// import { useParams } from 'next/navigation';
// import React from 'react';
// import { api } from '@/convex/_generated/api';
// import { ExpertsList } from '@/services/Options'; // you missed importing this too
// import Image from 'next/image';
// import moment from 'moment';
// import ChatBox from '@/app/(main)/dashboard/_components/ChatBox';
// import SummaryBox from './_components/SummaryBox';


// function ViewSummary() {
//     const { roomid } = useParams();
//     const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
//         id: roomid,
//     });

//     const GetAbstractImages = (option) => {
//         const coachingOption = ExpertsList.find((item) => item.name === option);
//         return coachingOption?.abstract;
//     };

//     if (!DiscussionRoomData) {
//         return <div>Loading...</div>; // Show a loading state while fetching
//     }

//     return (
//         <div className='-mt-10'>
//             <div className='flex justify-between items-end'>
//             <div className="flex gap-7 items-center">
//                 <Image 
//                     src={GetAbstractImages(DiscussionRoomData.coachingOption)} 
//                     alt='abstract' 
//                     width={100} 
//                     height={100} 
//                     className='w-[70px] h-[70px] rounded-full'
//                 />
//                 <div>
//                     <h2 className='font-bold text-lg'>{DiscussionRoomData.topic}</h2>
//                     <h2 className='text-gray-400'>{DiscussionRoomData.coachingOption}</h2>
//                 </div>
//             </div>
//             <h2 className='text-gray-400 '>
//                         {moment(DiscussionRoomData._creationTime).fromNow()}
//                     </h2>
//                     </div>
//             <div className='grid grid-cols-1 lg:grid-cols-4 gap-5 mt-5'>
//              <div className='col-end-3'>
//             <SummaryBox summary={DiscussionRoomData.summary}></SummaryBox>
//              </div>
//              <div className='col-span-2'>
//                 {DiscussionRoomData?.conversation && <ChatBox conversation={DiscussionRoomData?.conversation} coachingOption={DiscussionRoomData?.coachingOption} enableFeedbackNotes={false}></ChatBox>}
//              </div>
//             </div>
//         </div>
//     );
// }

// export default ViewSummary;


"use client";
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { api } from '@/convex/_generated/api';
import { ExpertsList } from '@/services/Options';
import Image from 'next/image';
import moment from 'moment';
import ChatBox from '@/app/(main)/dashboard/_components/ChatBox';
import SummaryBox from './_components/SummaryBox';

function ViewSummary() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
        id: roomid,
    });

    const GetAbstractImages = (option) => {
        const coachingOption = ExpertsList.find((item) => item.name === option);
        return coachingOption?.abstract;
    };

    if (!DiscussionRoomData) {
        return <div>Loading...</div>;
    }

    return (
        <div className='-mt-10'>
            <div className='flex justify-between items-end'>
                <div className="flex gap-7 items-center">
                    <Image 
                        src={GetAbstractImages(DiscussionRoomData.coachingOption)} 
                        alt='abstract' 
                        width={100} 
                        height={100} 
                        className='w-[70px] h-[70px] rounded-full'
                    />
                    <div>
                        <h2 className='font-bold text-lg'>{DiscussionRoomData.topic}</h2>
                        <h2 className='text-gray-400'>{DiscussionRoomData.coachingOption}</h2>
                    </div>
                </div>
                <h2 className='text-gray-400'>
                    {moment(DiscussionRoomData._creationTime).fromNow()}
                </h2>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5'>
                {/* Summary */}
                <div className='lg:col-span-2'>
                    <h2 className='text-lg font-bold mb-6'>Summary of Your Conversation</h2>
                    <SummaryBox summary={DiscussionRoomData.summary} />
                </div>

                {/* Conversation */}
                <div className='lg:col-span-1'>
                <h2 className='text-lg font-bold mb-6'>Your Conversation</h2>
                    {DiscussionRoomData?.conversation && (
                        <ChatBox 
                            conversation={DiscussionRoomData?.conversation} 
                            coachingOption={DiscussionRoomData?.coachingOption} 
                            enableFeedbackNotes={false} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewSummary;
