import express from "express"
import { prisma } from "../../prisma/index.js";
import { adminMiddleware } from "../middlewares/admin.middlewares.js";

const router = express.Router()

// // 가게 정보 등록
// router.post('/', adminMiddleware, async (req, res) => {
//     // controller
//     const { storeName, storeAddress, storeContact, storeContent } = req.body
//     const { aduserId } = req.user
//     if (!storeName) {
//         return res.status(401).json ({ message : "가게 이름을 입력하세요." })
//     }
//     if (!storeAddress) {
//         return res.status(401).json ({ message : "가게 주소를 입력하세요." })
//     }
//     if (!storeContact) {
//         return res.status(401).json ({ message : "가게 연락처를 입력하세요." })
//     }
//     if (!storeContent) {
//         return res.status(401).json ({ message : "가게 내용을 입력하세요." })
//     }

//     // repository
//     const storeInfo = await prisma.stores.create({
//         data : {
//             aduserId : +aduserId,
//             storeName,
//             storeAddress,
//             storeContact,
//             storeContent
//         }
//     })

//     return res.status(201).json({ message : "업체 정보 등록 완료.", storeInfo })
// })

// // 가게 정보 조회
// router.get('/:storeId', async (req, res) => {
//     // controller
//     const storeId = req.params.storeId

//     if (!storeId) {
//         return res.status(401).json ({ message : "가게 아이디를 입력하세요." })
//     }
//     // repository
//     const store = await prisma.stores.findFirst({
//         where : {
//             storeId : +storeId
//         },
//         select : {
//             storeId : true,
//             storeName : true,
//             storeAddress : true,
//             storeContact : true,
//             storeContent : true,
//             reviews : {
//                 select : {
//                     rate : true,
//                 }
//             }
//         }
//     })
//     if (!store) {
//         return res.status(401).json ({ message : "등록된 가게가 없습니다." })
//     }
//     // controller
//     return res.status(200).json ({ store })
// })

// //가게 목록 조회
// router.get('/', async (req, res) => {
//     // repository
//     const storeList = await prisma.stores.findMany({
//         select : {
//             storeId : true,
//             storeName : true,
//             storeAddress : true,
//             storeContact : true,
//             reviews : {
//                 select : {
//                     rate : true,
//                 }
//             }
//         }
//     })

//     return res.status(200).json ({ storeList })
// })

// // 가게 정보 수정
// router.patch('/:storeId', adminMiddleware, async (req, res) => {
//     const { storeId } = req.params
//     const { user } = req.user
//     const { storeName, storeAddress, storeContact, storeContent } = req.body

//     if (!storeId) {
//         return res.status(401).json ({ message : "가게 아이디는 필수값 입니다." })
//       }
//     if (!storeName) {
//         return res.status(401).json ({ message : "가게 이름은 필수값 입니다." })
//       }
//     if (!storeAddress) {
//         return res.status(401).json ({ message : "가게 주소는 필수값 입니다." })
//     }
//     if (!storeContact) {
//         return res.status(401).json ({ message : "가게 연락처는 필수값 입니다." })
//     }
//     if (!storeContent) {
//         return res.status(401).json ({ message : "가게 내용은 필수값 입니다." })
//     }

//     const store = prisma.stores.findFirst({
//         where : {
//             storeId : +storeId
//         }
//     })
//     if (!store) {
//         return res.status(401).json({ message: "존재하지 않는 가게 입니다." })
//     }
//     if (store.userId !== user) {
//         return res.status(401).json ({ message : "본인 가게만 수정 가능합니다." })
//     }

//     await prisma.stores.update({
//         where : {
//             storeId : +storeId
//         },
//         data : {
//             storeName,
//             storeAddress,
//             storeContact,
//             storeContent,
//         }
//     })
//     return res.status(201).json({ message : "가게 정보 수정이 완료 되었습니다." })
// })

// 가게 정보 삭제
// router.delete('/:storeId', adminMiddleware, async (req, res) => {
//     // controller
//     const { password } = req.body
//     const { storeId } = req.params
//     const { aduserId } = req.user
//     //repository
//     const storePw = await prisma.stores.findFirst({
//         where : {
//             storeId : +storeId
//         },
//         select : {
//             storeId : true,
//             aduser : {
//                 select : {
//                     aduserId : true,
//                     adPassword : true
//                 }
//             }
//         }
//     })
//     // controller : repository->service->controller return 계속 해서 넘겨주기?
//     if ( +aduserId !== storePw.aduser.aduserId) {
//         return res.status(401).json ({ message : "본인 가게 정보만 삭제 가능합니다." })
//     }
//     if (storePw.aduser.adPassword !== password) {
//         return res.status(401).json ({ message : "비밀번호가 일치 하지 않습니다." })
//     }
//     // repository
//     await prisma.stores.delete({
//                 where: {
//                     storeId: +storeId,
//                 },
//     })
//     // controller
//     return res.status(201).json({ message : "가게 정보가 삭제되었습니다." })
// })
// export default router
