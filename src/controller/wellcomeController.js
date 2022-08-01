class wellcomeController {
    home (req, res, next) {
        res.render('wellcome')
    }
}

module.exports = new wellcomeController