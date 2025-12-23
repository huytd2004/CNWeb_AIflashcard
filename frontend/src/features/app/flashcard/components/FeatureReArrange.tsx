// import { Button } from "@/components/ui/button"
// import { Example, Flashcard } from "@/types/type"
// import React, { useEffect, useState } from "react"
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
// interface FlashcardPieceExample {
//     _id: string // ID của flashcard gốc
//     en: string
//     vi: string
//     title: string
// }

// const shuffle = (array: any[]) => {
//     let currentIndex = array.length,
//         randomIndex
//     while (currentIndex != 0) {
//         randomIndex = Math.floor(Math.random() * currentIndex)
//         currentIndex--
//         ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
//     }
//     return array
// }

// const initialItems = [
//     { id: "item-1", content: "Item 1" },
//     { id: "item-2", content: "Item 2" },
//     { id: "item-3", content: "Item 3" },
//     { id: "item-4", content: "Item 4" },
// ]

// const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list)
//     const [removed] = result.splice(startIndex, 1)
//     result.splice(endIndex, 0, removed)
//     return result
// }
// interface FeatureReArrageProps {
//     flashcards?: Flashcard[]
// }
// export default function FeatureReArrage({ flashcards }: FeatureReArrageProps) {
//     const [suffledCards, setSuffledCards] = useState<FlashcardPieceExample[]>([])
//     const [items, setItems] = useState(initialItems)

//     const onDragEnd = (result) => {
//         // dropped outside the list
//         if (!result.destination) {
//             return
//         }

//         const reorderedItems = reorder(items, result.source.index, result.destination.index)

//         setItems(reorderedItems)
//     }

//     const createFlashcardPieces = (fc: Flashcard[]): FlashcardPieceExample[] => {
//         const pieces: FlashcardPieceExample[] = []
//         fc.forEach((card) => {
//             const randomEx = card.example[Math.floor(Math.random() * card.example.length)]
//             pieces.push({ _id: card._id, en: randomEx.en, vi: randomEx.vi, title: card.title })
//         })
//         return pieces
//     }

//     useEffect(() => {
//         const sliceFC = flashcards && flashcards.length > 5 ? flashcards?.slice(0, 5) : flashcards || []

//         const allPieces = createFlashcardPieces(sliceFC)
//         const shuffled = shuffle(allPieces) // Hàm shuffle của bạn
//         setSuffledCards(shuffled) // Cập nhật state với mảng đã trộn
//     }, [flashcards])

//     return (
//         <div className="p-5 flex flex-col h-full gap-3">
//             {/* {suffledCards?.map((card, index) => (
//                 <div key={`${card._id}-${index}`} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
//                     <p className="text-lg">{card.en.replace(new RegExp(card.title, "gi"), "_".repeat(card.title.length + 5))}</p>
//                 </div>
//             ))}
//             <div className="flex gap-3 flex-wrap mt-5">
//                 {suffledCards.map((card, index) => (
//                     <Button key={`${card._id}-${index}`} variant="secondary" className="text-white h-auto">
//                         {card.title}
//                     </Button>
//                 ))}
//             </div> */}
//             <DragDropContext onDragEnd={onDragEnd}>
//                 <Droppable droppableId="droppable-list">
//                     {(provided) => (
//                         <div {...provided.droppableProps} ref={provided.innerRef}>
//                             <h2>Drag and Drop List with react-beautiful-dnd</h2>
//                             {items.map((item, index) => (
//                                 <Draggable key={item.id} draggableId={item.id} index={index}>
//                                     {(provided, snapshot) => (
//                                         <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-center justify-between ${snapshot.isDragging ? "#e0f7fa" : "#f9f9f9"}`}>
//                                             {item.content}
//                                         </div>
//                                     )}
//                                 </Draggable>
//                             ))}
//                             {provided.placeholder}
//                         </div>
//                     )}
//                 </Droppable>
//             </DragDropContext>
//         </div>
//     )
// }
