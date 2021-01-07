async getUser(req, res) {
            try {
                let cnt = await userSchema.countDocuments();
                let limit = Number(req.query.limit);
                let skip = req.query.page_no * limit;
                console.log(skip, limit)
                let name = req.query.name ? req.query.name : '';
                let result = await userSchema.find({name: {$regex: name}}).skip(skip).limit(limit).sort({_id: 1});
                return res.send(controller.successFormat({ data: result }));
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 400));
            }
        }
