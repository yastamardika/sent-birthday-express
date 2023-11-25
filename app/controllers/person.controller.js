
const {Op} = require("sequelize")
const db = require("../../models")
const moment = require("moment")
const axios = require('axios')
const Person = db.person

exports.create = (req, res) => {
  if (!req.body.first_name) {
    return res.status(400).send({
      check: req.body,
      message: "Title can not be empty",
    });
  }
  const birth_date = moment(req.body.birth_date,"DD-MM-YYYY")
  const person_timezone = new Date().getTimezoneOffset()/60
  const current_local_time = moment()
  const relative_cut_off_time = moment().utc(person_timezone).hour(9).minute(0).second(0).millisecond(0)
  
  let birthday_status 
  if ((current_local_time.format('MM-DD') === birth_date.format('MM-DD')) && current_local_time.isBefore(relative_cut_off_time)){
    birthday_status = "pending"
  }else{
    birthday_status = "done"
  }
  
  const person = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    birth_date: birth_date.format('YYYY-MM-DD'),
    formatted_location: req.body.formatted_location,
    time_zone: person_timezone,
    job_birthday_status: birthday_status,
  };

  Person.create(person)
    .then((data) => {
      res.json({
        message: "Person created successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message ||
          "Some error occurred while creating the Person's data.",
        data: null,
      });
    });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Person.destroy({
      where: { id },
    })
      .then((num) => {
        if (num == 1) {
          res.json({
            message: "Person's data deleted successfully.",
            data: req.body,
          });
        } else {
          res.json({
            message: `Cannot delete person data with id=${id}. Maybe this person was not found!`,
            data: req.body,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message || "Some error occurred while deleting this person data.",
          data: null,
        });
      });
  };

exports.findAll = (req, res) => {
  Person.findAll()
    .then((people) => {
      res.json({
        message: "People retrieved successfully.",
        data: people,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving people's data.",
        data: null,
      });
    });
};

exports.setBirthDayStatus = (req, res) => {
  Person.findAll({
    where: {
      job_birthday_status: "done",
    }
  })
  .then((people) => {
    const born_today = []
    people.forEach(person => {
      birth_date = moment(person.birth_date).format('MM-DD')
      if (moment().format('MM-DD') === birth_date) {
        Person.update({job_birthday_status: "pending"}, {
          where: {id :person.id} ,
        })
          .then( (num) => {
            console.log(born_today);
            if (num == 1) {
            } else {
              res.json({
                message: `Cannot update person with id=${id}. Maybe this person was not found or params is empty!`,
                data: person,
              });
            }
          })
      }else {
        return 0
      }
    });
    res.json({
      message: "success",
      status_code: 200,
    });
  })   
}

exports.sentBirthDayMail = (req, res) => {
  const nine_am = moment().hour(9).minute(0).second(0).millisecond(0)
  // const current = moment().hour(14) //testing purpose
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  if (moment().isSame(nine_am)){
    Person.findAll({
      where: {
        job_birthday_status: "pending",
      }
    })
    .then((people) => {
      const allRequest = people.map(async (person, index) => {
        try {
          await delay(1000 * index);
          const response = await axios.post("https://email-service.digitalenvision.com.au/send-email", {
            "email": `${person.first_name}@mail.com.au`,
            "message": `Hi ${person.first_name}, Happy birthdayyy!!!`
          })
          if (response.data.status == 'sent') {
            const updateSentStatus = await Person.update({job_birthday_status:"done"}, {where:{id:person.id}})
            console.log(updateSentStatus);
          }
          return {
            to: person.first_name,
            status: response.data.status,
            sentTime: response.data.sentTime,
          };
        } catch (error) {
          return {
            to: person.first_name,
            err_message: error.message,
            status: 'Error',
            sentTime: null,
          };
        }
        
      })
      Promise.all(allRequest)
      .then(results => {
        res.status(200).json(results); // Send the aggregated results as a single response
      })
      .catch(error => {
        console.error('Error processing requests:', error);
        res.status(500).json({ error: 'Failed to process requests' });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving people's data.",
        data: null,
      });
    });
  }else{
    res.status(200).json({
      message: "No mail sent",
    });
  }
}