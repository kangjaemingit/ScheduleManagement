
const calendarController={
    index : (req, res) => {
        res.render('calendarPage/calendarPage', { title: 'Express',user : req.user  });
    }

}
module.exports=calendarController;
