const { default: slugify } = require("slugify")
const { SOModel, DataSOModel } = require("../models/SO")
const generateRandomSlug = require("../services/random-slug")

const ALLOWED_FILE_TYPES = new Set(["pdf", "xlsx", "docx"])

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0

const isValidQuestArray = (quest) => {
    if (!Array.isArray(quest) || quest.length === 0) return false
    return quest.every((item) => item && typeof item === "object" && isNonEmptyString(item.question) && isNonEmptyString(item.answer))
}

const addSubOutline = async (req, res) => {
    try {
        const { title, content, image, type, link, quest, file_size } = req.body
        const { id } = req.user
        if (!isNonEmptyString(title)) {
            return res.status(400).json({ ok: false, message: "Vui lòng nhập tiêu đề" })
        }

        // Text outline: require quest array
        if (type === "txt" || quest) {
            if (!isValidQuestArray(quest)) {
                return res.status(400).json({ ok: false, message: "Vui lòng nhập danh sách câu hỏi/đáp án hợp lệ" })
            }
            const newDataSO = new DataSOModel({
                data_so: quest,
            })
            const saveDataSO = await newDataSO.save()
            const newSO = new SOModel({
                user_id: id,
                version: 2,
                slug: slugify(title, { lower: true }) + "-" + generateRandomSlug(),
                title,
                content,
                type: "txt",
                image,
                lenght: quest.length,
                quest: saveDataSO._id,
                date: Date.now(),
            })

            const savedSO = await newSO.save()
            return res.status(201).json({ ok: true, message: "Thêm thành công", so: savedSO, slug: savedSO.slug })
        } else {
            if (!isNonEmptyString(type) || !ALLOWED_FILE_TYPES.has(type)) {
                return res.status(400).json({ ok: false, message: "Loại file không hợp lệ" })
            }
            if (!isNonEmptyString(link)) {
                return res.status(400).json({ ok: false, message: "Vui lòng nhập link file" })
            }
            const parsedSize = Number(file_size)
            if (!Number.isFinite(parsedSize) || parsedSize < 0) {
                return res.status(400).json({ ok: false, message: "Kích thước file không hợp lệ" })
            }
            const newSO = new SOModel({
                user_id: id,
                version: 2,
                slug: slugify(title, { lower: true }) + "-" + generateRandomSlug(),
                title,
                content,
                type,
                link,
                image,
                lenght: parsedSize,
                date: Date.now(),
            })

            const savedSO = await newSO.save()
            return res.status(201).json({ ok: true, link: savedSO.slug, slug: savedSO.slug, message: "Thêm thành công", so: savedSO })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const getSubOutline = async (req, res) => {
    try {
        const { page = 1, limit = 8, search } = req.query
        const skip = (page - 1) * limit
        const query = {}

        query.type = "txt"

        if (search) {
            query.title = { $regex: search, $options: "i" }
        }

        const [SO, total] = await Promise.all([
            SOModel.find(query).populate("quest", "data_so").populate("user_id", "_id displayName profilePicture").skip(skip).limit(limit).sort({ date: -1 }).lean(),
            SOModel.countDocuments(query),
        ])

        const totalPages = Math.ceil(total / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1

        return res.status(200).json({
            ok: true,
            publicSO: SO,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage,
                hasPrevPage,
            },
        })
        // const findText = await SOModel.find({ type: "txt" }).populate("quest", "data_so").populate("user_id", "_id displayName profilePicture").sort({ date: -1 });
        // const findFile = await SOModel.find({ type: { $ne: "txt" } })
        //     .populate("user_id", "_id displayName profilePicture")
        //     .sort({ date: -1 });
        // res.status(200).json({ findText, findFile });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const getSubOutlineAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, type } = req.query
        const skip = (Number(page) - 1) * Number(limit)
        const query = {}
        if (search) {
            query.title = { $regex: search, $options: "i" }
        }
        if (type) {
            query.type = type
        }

        const [items, total] = await Promise.all([
            SOModel.find(query)
                .populate("quest", "data_so")
                .populate("user_id", "_id displayName profilePicture")
                .skip(skip)
                .limit(Number(limit))
                .sort({ date: -1 })
                .lean(),
            SOModel.countDocuments(query),
        ])

        const totalPages = Math.ceil(total / Number(limit))
        return res.status(200).json({
            ok: true,
            findText: items,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalItems: total,
                itemsPerPage: Number(limit),
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const getSubOutlineByUser = async (req, res) => {
    try {
        const { id } = req.user
        const subOutline = await SOModel.find({ user_id: id }).populate("user_id", "_id displayName profilePicture").sort({ date: -1 })
        if (!subOutline) {
            return res.status(404).json({ message: "Không tìm thấy", ok: false })
        }
        res.status(200).json(subOutline)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const getSubOutlineBySlug = async (req, res) => {
    try {
        const { id } = req.params
        const subOutline = await SOModel.findOne({ slug: id }).populate("quest", "data_so")
        if (!subOutline) {
            return res.status(404).json({ message: "Không tìm thấy", ok: false })
        }
        res.status(200).json(subOutline)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const updateSO = async (req, res) => {
    try {
        const { id, image, quest, so_id, lenght, title, link, type } = req.body
        const updateFields = {}
        if (image !== undefined) updateFields.image = image
        if (lenght !== undefined) updateFields.lenght = lenght
        if (link !== undefined) updateFields.link = link
        if (type !== undefined) updateFields.type = type
        if (title !== undefined) {
            updateFields.title = title
            updateFields.slug = slugify(title, { lower: true }) + "-" + generateRandomSlug()
        }

        const update_profile = await SOModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true })
        if (!update_profile) {
            return res.status(400).json({ message: "Cập nhật thông tin không thành công" })
        }

        if (so_id && quest) {
            await DataSOModel.findByIdAndUpdate(so_id, { $set: { data_so: quest } }, { new: true })
        }

        return res.status(200).json({ ok: true, message: "Cập nhật thành công", update_profile })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const updateViewSO = async (req, res) => {
    try {
        const { id } = req.params
        const so = await SOModel.findOne({ _id: id })
        if (!so) {
            return res.status(404).json({ message: "Không tìm thấy", ok: false })
        }
        const update = await SOModel.findByIdAndUpdate(id, { $set: { view: so.view + 1 } }, { new: true })
        res.status(200).json({ ok: true, update })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const deleteSubOutline = async (req, res) => {
    try {
        const { id } = req.body
        const so = await SOModel.findById(id).lean()
        if (!so) {
            return res.status(404).json({ ok: false, message: "Không tìm thấy" })
        }
        await SOModel.findByIdAndDelete(id)
        if (so.quest) {
            await DataSOModel.findByIdAndDelete(so.quest)
        }
        res.status(200).json({ message: "Xóa thành công" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

module.exports = {
    addSubOutline,
    getSubOutlineAdmin,
    getSubOutline,
    getSubOutlineByUser,
    getSubOutlineBySlug,
    updateSO,
    updateViewSO,
    deleteSubOutline,
}
