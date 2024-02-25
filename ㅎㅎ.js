deleteStoreInfo = async (req, res, next) => {
    try {
        const { storId } = req.params;
        const { aduserId } = req.user;
        const { password } = req.body;
        const store = await this.storesService.deleteStoreInfo(storId, aduserId);
        if (!aduserId) {
            return res.status(401).json({ message: "권한이 없습니다." });
        }
        if (password === req.user.adPassword) {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }
        return res.status(201).json({ message: "가게 정보가 삭제되었습니다." });
    } catch (err) {
        next(err);
    }
};
deleteStoreInfo = async (storeId, aduserId) => {
    const storePw = await this.storesRepository.deleteStoreInfo(storeId, aduserId);
    return storePw;
};

deleteStoreInfo = async (storeId, aduserId) => {
    const storePw = await this.prisma.stores.delete({
        where: {
            storeId: +storeId,
            aduserId: +aduserId,
        },
    });
    return storePw;
};
