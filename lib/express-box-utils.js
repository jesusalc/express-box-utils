// ./lib/express-box-utils.js

'use strict';
const log = console.log;

const Box = x =>
  ({
    chain: f => f(x),
    map: f => Box(f(x)),
    ap: other => other.map(x),
    fold: f => f(x),
    raw: f => f,
    concat: o =>
      o.fold(y => Box(o.concat(y))),
    inspect: () => `Box(${x})`,
    toString: () => `Box(${x})`
  });


const Right = x =>
  ({
    chain: f => f(x),
    ap: other => other.map(x),
    traverse: (of, f) => f(x).map(Right),
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
    raw: (x, y) => y,
    concat: o =>
      o.fold(_ => Right(x),
        y => Right(x.concat(y))),
    inspect: () => `Right(${x})`,
    toString: () => `Right(${x})`
  });

const Left = x =>
  ({
    chain: f => Left(x),
    ap: other => Left(x),
    traverse: (of, f) => of(Left(x)),
    map: f => Left(x),
    fold: (f, g) => f(x),
    raw: (x, y) => x,
    concat: o =>
      o.fold(_ => Left(x),
        y => o),
    inspect: () => `Left(${x})`,
    toString: () => `Left(${x})`
  });

const arrayCompare = (a1, a2) => {
  if (a1.length !== a2.length) return false;
  let length = a2.length;
  for (let i = 0; i < length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    if (a1[i] !== a2[i]) return false;
  }
  return true;
};

const inArray = (needle, haystack) => {
  let length = haystack.length;
  for (let i = 0; i < length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    if (typeof haystack[i] === 'object') {
      //eslint-disable-next-line security/detect-object-injection
      if (arrayCompare(haystack[i], needle)) return true;
    } else {
      //eslint-disable-next-line security/detect-object-injection
      if (haystack[i] === needle) return true;
    }
  }
  return false;
};

const Describe = o => {
  log('--------------------------------------------------------------');
  log('Object instanceof ?', (o instanceof Object));
  if (o != null) log('It is not null');
  if (o == null) log('It is null');
  if (o != null) log('Object has constructor?', o.constructor, 'Object?', (o.constructor === Object), 'Array?', (o.constructor === Array));
  if (o == null) log('null so constructor will fail');
  log('It is a typeof function ?', typeof o, typeof o === 'function');
  log('It is a typeof object ?', typeof o, typeof o === 'object');
  if (o != null) log('It has a typeof constructor ? ', typeof o.constructor, 'Tt as a typeof function constructor?', (typeof o.constructor === 'function'));
  if (o == null) log('null so typeof constructor will fail');
  if (o instanceof Object && typeof o === 'object') log('Object Object');
};

const isObject = o => {
  if (o == null) return false;
  if (o instanceof Object && o.constructor === Array) return false;
  if (o instanceof Object && o.constructor === Function) return false;
  return o instanceof Object && (o.constructor === Object || typeof o.constructor === Function);
};

const Returnable = y =>
  inArray(y, [500, 404]) ? Right(y) : Left(y);

const ReturnNow = (arr, val) =>
  inArray(val, arr);

const DescribeObject = val => {
  log('            is an object!: ', val);
  log('            val != null: ', val !== null);
  log('            val.length!: ', Object.keys(val).length);
  log('                      =: ', val !== null && Object.keys(val).length > 0);
};

const Errable = (x, y) =>
  x != null ? Left(x) : Right(y);

const Emptyable = (x, y) =>
  isEmpty(x) ? Right(y) : Left(x);

const NullifyEmpty = x =>
  isEmpty(x) ? null : x;


const HasContent = (x, y) =>
  isEmpty(x) ? Left(x) : Right(y);

const NotFound = y =>
  isEmpty(y) ? Left(null) : Right(y);


const Either = x =>
  x == null ? Left(null) : Right(x);

const fromNullable = x =>
  x != null ? Right(x) : Left(null);

const tryCatch = f => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};
function isFunction(test) {
  return (Object.prototype.toString.call(test).indexOf('Function') > -1);
}

function isEmpty(e) {
  if (typeof e === 'undefined') return true;
  if ((typeof e === 'boolean' || e instanceof Boolean)) return false;
  if ((typeof e === 'number' || e instanceof Number)) return false;
  switch (e) {
    case [{}]:
    case []:
    case {}:
    case '':
    case null:
    case false:
    case typeof this === 'undefined':
      return true;
    default:
      if (isObject(e)) {
        if (e != null && Object.keys(e).length > 0) return false;
        if (e == null || Object.keys(e).length === 0) return true;
      }
      if (Array.isArray(e)) {
        // this is case []:
        if (e == null) {
          return true;
        } else {
          // this is case [{}]:
          if (e[0] == null) {
            return true;
          } else {
            if (isObject(e[0])) {
              if (e[0] != null && Object.keys(e[0]).length > 0) return false;
              if (e[0] == null || Object.keys(e[0]).length === 0) return true;
            }
          }
        }
        return e.length === 0;
      }
      if (isFunction(e)) {
        if ('function' === typeof e) return e.length === 0;
      }
      if (e instanceof Error) return e.message === '';

      // Objects...
      if (e.toString === toString) {
        switch (e.toString()) {
          // Maps, Sets, Files and Errors...
          case '[object File]':
          case '[object Map]':
          case '[object Set]': {
            return e.size === 0;
          }

          // Plain objects...
          case '[object Object]': {
            for (let key in e) {
              if (hasOwnProperty.call(e, key)) return false;
            }

            return true;
          }
        }
      }

      // Anything Else
      return false;
  }
}

const Resolve = (err, data) =>
  Errable(err, data)
    .raw(err,
      NotFound(data)
        .raw('404 - Not found', data));

const GrabResult = (err, data) =>
  Errable(err, data).raw(err, data);

const FlipEmpty = (err, data) =>
  Emptyable(err, data).raw(err, data);


const GrabStatus = (err, data) =>
  NotFound(err).raw(HasContent(data).raw(404, 200), (typeof err === 'number' ? err : 500));


/**
 * Removes the undefined or null elements
 *
 * Sample use
 * var test = {
      test1 : null,
      test2 : 'somestring',
      test3 : 3,
  }

 clean(test);
 results > console.log(test);
 results > { test2: 'somestring', test3: 3 }

 * Modifies the object internally, returns undefined

 * REF: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
 *
 * @param obj
 * @constructor
 */
const Clean = obj => {
  let propNames = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < propNames.length; i++) {
    //eslint-disable-next-line security/detect-object-injection
    let propName = propNames[i];
    //eslint-disable-next-line security/detect-object-injection
    if (obj[propName] === null || obj[propName] === undefined) {
      //eslint-disable-next-line security/detect-object-injection
      delete obj[propName];
    }
  }
};

/**
 * Enforce parameters
 *
 * If the parameter is missing it will send output to express. and return false.
 *
 * Use Cases
 *
 if (EnforcedParameter(req, res, 'eid')) { return }
 if (EnforcedParameter(req, res, 'type')) { return }
 if (EnforcedParameter(req, res, 'order')) { return }
 if (EnforcedParameter(req, res, 'alt')) { return }
 if (EnforcedParameter(req, res, 'image', 'files')) { return }
 if (EnforcedParameter(req, res, 'image', 'body')) { return }
 if (EnforcedParameter(req, res, 'image', 'params')) { return }
 if (EnforcedParameter(req, res, 'name')) { return }
 *
 *
 * @param req
 * @param res
 * @param key
 * @param body
 * @returns {boolean}  true if it was fired and false if not Enforcement was needed.
 * @constructor
 *
 */
const EnforcedParameter = (req, res, key, body = 'body') =>
  //eslint-disable-next-line security/detect-eval-with-expression
  !(key in eval('req.' + body)) ? res.status(400).json({parameter_required: key}) : false;



/**
 * Missing Parameters
 *
 * If the parameters are missing it will send out put to express. and return false.
 *
 * Sample Use
 *
 *  if (MissingParameters(req, res, ['eid', 'type', 'order', 'alt', 'name'])) { return }
 if (MissingParameters(req, res, ['image'], 'files')) { return }

 *
 * @param req
 * @param res
 * @param keys
 * @param body
 * @param target
 * @returns {boolean}
 * @constructor
 */
const MissingParameters = (req, res, keys, body = 'body', target = 'req') => {
  let not_found = [];
  keys.forEach(key => {
    // eslint-disable-next-line security/detect-eval-with-expression
    !(key in eval('' + target + '.' + body)) ? not_found.push(key) : this;
  });
  return !(((not_found.length > 0) ?
    (not_found.length > 1) ? res.status(400).json({parameters_required: not_found}) :
      res.status(400).json({parameter_required: not_found}) :
    false) === false);
};

/**
 * Converts Express 4 app routes to an array representation suitable for easy parsing.
 * @arg {Array} stack An Express 4 application middleware list.
 * @returns {Array} An array representation of the routes in the form [ [ 'GET', '/path' ], ... ].
 */
const getRoutes = stack => {
  const routes = (stack || [])
    // We are interested only in endpoints and router middleware.
    .filter(it => it.route || it.name === 'router')
    // The magic recursive conversion.
    .reduce((result, it) => {
      if (! it.route) {
        // We are handling a router middleware.
        const stack = it.handle.stack;
        const routes = getRoutes(stack);

        return result.concat(routes);
      }

      // We are handling an endpoint.
      const methods = it.route.methods;
      const path = it.route.path;

      const routes = Object
        .keys(methods)
        .map(m => [m.toUpperCase(), path]);

      return result.concat(routes);
    }, [])
    // We sort the data structure by route path.
    // eslint-disable-next-line no-unused-vars
    .sort((prev, next) => {
      // eslint-disable-next-line no-unused-vars
      const [prevMethod, prevPath] = prev;
      // eslint-disable-next-line no-unused-vars
      const [nextMethod, nextPath] = next;

      if (prevPath < nextPath) {
        return -1;
      }

      if (prevPath > nextPath) {
        return 1;
      }

      return 0;
    });

  return routes;
};
const displayAllRoutes = (app, logger) => {
  const all_routes = getRoutes(app._router && app._router.stack);
  logger.info('routes count:', all_routes.length);
  all_routes.sort().forEach(route => {
    logger.info('\x1b[38;5;196m    |     \x1b[38;5;195m' + route[0] + ' '.repeat(10 - route[0].length) + '\x1b[38;5;196m | \x1b[38;5;195m' + route[1] + ' '.repeat(Math.abs(25 - route[1].length)) + '\x1b[38;5;196m | \x1b[38;5;195m');
  });
};
const MissingKeys = (keys, target_keys, message, logger) => {
  let not_found = [];
  keys.forEach(key => {
    if (typeof target_keys === 'object' && target_keys instanceof Array) {
      !(target_keys.indexOf(key) > -1) ? not_found.push(key) : this;
    } else {
      !(key in target_keys) ? not_found.push(key) : this;
    }
  });
  if (not_found.length > 0 && logger) logger.error('' + message + '', not_found);
  return not_found;
};

const sanitize = require('express-mongo-sanitize');
/**
 * Sample use
 *    app.use(require('express-box-utils').boxed);
 */
const boxed = (req, res, next) => {
  req.NullifyEmpty = NullifyEmpty;
  req.EnforcedParameter = EnforcedParameter;
  req.MissingParameters = MissingParameters;
  req.Sanitize = sanitize.sanitize;
  req.FlipEmpty = FlipEmpty;
  req.Emptyable = Emptyable;
  req.CleanByPointer_NullReturn = Clean;
  req.GrabResult = GrabResult;
  req.GrabStatus = GrabStatus;
  req.Resolve = Resolve;
  req.HasContent = HasContent;
  req.isFunction = isFunction;
  req.isEmpty = isEmpty;
  req.Describe = Describe;
  req.DescribeObject = DescribeObject;
  req.isObject = isObject;
  req.Returnable = Returnable;
  req.Box = Box;
  req.ReturnNow = ReturnNow;
  req.arrayCompare = arrayCompare;
  req.inArray = inArray;
  req.Right = Right;
  req.Left = Left;
  req.NotFound = NotFound;
  req.Either = Either;
  req.Errable = Errable;
  req.fromNullable = fromNullable;
  req.tryCatch = tryCatch;
  req.of = Right;
  next();
};
module.exports = {boxed, NullifyEmpty, MissingKeys, displayAllRoutes, EnforcedParameter, MissingParameters, FlipEmpty, Emptyable, Clean, GrabResult, GrabStatus, Resolve, HasContent, isFunction, isEmpty, Describe, DescribeObject, isObject, Returnable, Box, ReturnNow, arrayCompare, inArray, Right, Left, NotFound, Either, Errable, fromNullable, tryCatch, of: Right};
