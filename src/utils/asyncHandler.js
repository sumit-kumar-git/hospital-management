// asyncHandler by promises

const asyncHandler = (requestHandler) =>  {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
               .catch((err) => next(err))
    }
}


export {asyncHandler}



// asyncHandler by try and catch

// const asyncHandler = (func) => async(req,res,next) =>{
//     try {
//         await func(req,res,next)
//     } catch (err) {
//         res.status(err.code || 500).json(
//             {
//                 message:err.message,
//                 success:false
//             }
//         )
//     }
// }