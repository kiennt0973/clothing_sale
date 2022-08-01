class scheduleController {
    student(req, res, next) {
        res.render('schedule/student')
    }

    teacher(req, res, next) {
        res.render('schedule/teacher')
    }
    
    admin(req, res, next) {
        res.render('schedule/admin')
    }

}

module.exports = new scheduleController