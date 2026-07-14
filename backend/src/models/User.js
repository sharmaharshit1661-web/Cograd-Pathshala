import Student from './student/Student.js';
import Teacher from './teacher/Teacher.js';
import Parent from './parent/Parent.js';

const _getModel = (query = {}, data = {}) => {
  const role = query.role || data.role;
  if (role === 'student') return Student;
  if (role === 'teacher') return Teacher;
  if (role === 'parent') return Parent;

  // Check query for ID prefix
  const id = query.id || query._id || (query.$or && query.$or.find(o => o.id || o._id)?.id);
  if (typeof id === 'string') {
    if (id.startsWith('stu_')) return Student;
    if (id.startsWith('tch_') || id.startsWith('teacher_')) return Teacher;
    if (id.startsWith('parent_')) return Parent;
  }

  // Default fallback
  return Student;
};

const User = {
  find: function(query = {}, ...args) {
    const role = query.role;
    if (role === 'student') return Student.find(query, ...args);
    if (role === 'teacher') return Teacher.find(query, ...args);
    if (role === 'parent') return Parent.find(query, ...args);

    // If no role is specified (e.g. querying studentUsers by phone in demo bookings),
    // return a Thenable that queries Student and Parent collections and merges the results.
    const studentQuery = Student.find(query, ...args);
    const parentQuery = Parent.find(query, ...args);

    return {
      then: function(resolve, reject) {
        Promise.all([studentQuery, parentQuery])
          .then(([students, parents]) => {
            resolve([...students, ...parents]);
          })
          .catch(reject);
      }
    };
  },

  findOne: function(query = {}, ...args) {
    const model = _getModel(query);
    return model.findOne(query, ...args);
  },

  findById: function(id, ...args) {
    if (typeof id === 'string') {
      if (id.startsWith('stu_')) return Student.findById(id, ...args);
      if (id.startsWith('tch_') || id.startsWith('teacher_')) return Teacher.findById(id, ...args);
      if (id.startsWith('parent_')) return Parent.findById(id, ...args);
    }
    return Student.findById(id, ...args);
  },

  create: function(data, ...args) {
    const model = _getModel({}, data);
    return model.create(data, ...args);
  },

  findOneAndDelete: function(query = {}, ...args) {
    const model = _getModel(query);
    return model.findOneAndDelete(query, ...args);
  },

  findOneAndUpdate: function(query = {}, update = {}, ...args) {
    const model = _getModel(query, update);
    return model.findOneAndUpdate(query, update, ...args);
  },

  updateMany: function(query = {}, update = {}, ...args) {
    const model = _getModel(query, update);
    return model.updateMany(query, update, ...args);
  },

  countDocuments: function(query = {}, ...args) {
    const model = _getModel(query);
    return model.countDocuments(query, ...args);
  }
};

export default User;
