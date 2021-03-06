(function () {
  var BaseModel, ProjectVariables, Utils,
    bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    },

    extend = function (child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) {
          child[key] = parent[key];
        }
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    hasProp = {}.hasOwnProperty;

  BaseModel = require('../BaseModel');

  Utils = require('../Utils');

  ProjectVariables = (function (superClass) {
    var list;

    extend(ProjectVariables, superClass);

    function ProjectVariables() {
      this.create = bind(this.create, this);
      this.show = bind(this.show, this);
      this.all = bind(this.all, this);
      return ProjectVariables.__super__.constructor.apply(this, arguments);
    }

    list = function (projectId, fn) {
      if (fn == null) {
        fn = null;
      }
      console.log('DEPRECATED: variables.list. Use variables.all instead');
      return this.all.apply(this, arguments);
    };

    ProjectVariables.prototype.all = function (projectId, fn) {
      var cb, data, params;
      var idStr = (Utils.parseProjectId(projectId)) + "/variables";
      if (fn == null) {
        fn = null;
      }
      this.debug("Projects::Variables::all()");
      params = {};
      if (params.page == null) {
        params.page = 1;
      }
      if (params.per_page == null) {
        params.per_page = 100;
      }
      data = [];
      cb = (function (_this) {
        return function (err, retData) {
          if (err) {
            if (fn) {
              return fn(retData || data);
            }
          } else if (retData.length === params.per_page) {
            _this.debug("Recurse Projects::Variables::all()");
            data = data.concat(retData);
            params.page++;
            return _this.get("projects/" + idStr, params, cb);
          } else {
            data = data.concat(retData);
            if (fn) {
              return fn(data);
            }
          }
        };
      })(this);
      return this.get("projects/" + idStr, params, cb);
    };

    ProjectVariables.prototype.show = function (projectId, variableId, fn) {
      var idStr = (Utils.parseProjectId(projectId)) +
        "/variables/" +
        (parseInt(variableId));

      if (fn == null) {
        fn = null;
      }
      this.debug("Projects::Variables::show()");

      return this.get("projects/" + idStr, (function (_this) {
        return function (data) {
          if (fn) {
            return fn(data);
          }
        };
      })(this));
    };

    ProjectVariables.prototype.create = function (projectId, key, value, fn) {
      var params;
      var idStr = (Utils.parseProjectId(projectId)) + "/variables";
      if (fn == null) {
        fn = null;
      }
      params = {};
      params.key = key;
      params.value = value;
      this.debug("Projects::Variables::create()", params);

      return this.post("projects/" + idStr, params, (function (_this) {
        return function (data) {
          if (fn) {
            return fn(data);
          }
        };
      })(this));
    };

    return ProjectVariables;

  })(BaseModel);

  module.exports = function (client) {
    return new ProjectVariables(client);
  };

}).call(this);