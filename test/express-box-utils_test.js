// ./test/express-box-utils_test.js

'use strict';
const chakram = require('chakram');
const expect = chakram.expect;

const {NullifyEmpty, MissingKeys, of, EnforcedParameter, MissingParameters, FlipEmpty, Emptyable, Clean, GrabResult, GrabStatus, Resolve, HasContent, isFunction, isEmpty, isObject, arrayCompare, inArray, Right, Left, NotFound, Either, Errable, fromNullable, tryCatch, Box} = require('../lib/express-box-utils');
if (MissingKeys(['NODE_ENV'], process.env, 'ERROR: IMPORTANT ENVIRONMENT KEYS MISSING', console).length > 0)
  process.exit(1);

const images = [{updated_at: '2018-02-02T17:03:46.904Z', _id: '5a7498198905e800076b1cfb'}, {updated_at: '2018-02-02T17:03:46.904Z', _id: '5a7498198905e800076b1cfb'},
  {updated_at: '2018-02-02T16:54:02.985Z', _id: '5a7497ab78c22400072fd2e6'}
];
const val = [];
/**
 * Manually invoke:
 *
 * LOG=OFF ./node_modules/.bin/mocha test/utils_test.js --exit --silent
 *
 * or
 *
 * npm run 1test -g test/utils_test.js --silent
 */
describe('Utils', function() {
  let req = {
    body: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    params: {
      a: 'a',
      b: 'b',
      c: 'c'
    }
  };

  let res = {
    status: function(param) {
      return this;
    },
    json: function(param) {
      return param;
    }
  };

    /* Disable - start */
  let write;
  let log;
  let output = '';


  // restore process.stdout.write() and console.log() to their previous glory
  let cleanup = () => {
    process.stdout.write = write;
    console.log = log;
  };

  beforeEach(() => {
    // store these functions to restore later because we are messing with them
    write = process.stdout.write;
    log = console.log;

    // our stub will concatenate any output to a string
    process.stdout.write = console.log = s => {
      output += s;
    };
    if (output !== '') {
      console.log('done');
    }
  });

  // restore after each test
  afterEach(cleanup);
  /* Disable - end */



  describe('Box', function() {
    let str = 59;
    it ('1800', () => {
      expect(Box(str).map(i => String.fromCharCode(i)).fold(c => c.toLowerCase())).to.equal(';');
    });
  });

  describe('of', function() {
    it ('1700', () => {
      expect(of(images).raw({}, images)).to.deep.equal(images);
    });
  });

  describe('tryCatch', function() {
    it ('1600', () => {
      expect(tryCatch(console.log).raw({}, images)).to.deep.equal(images);
    });
    it ('1601', () => {
      expect(tryCatch(undefined).raw({}, images)).to.deep.equal({});
    });
  });

  describe('Either', function() {
    it ('1500', () => {
      expect(Either(null).raw(null, images)).to.deep.equal(null);
    });
    it ('1501', () => {
      expect(Either(null).raw({}, images)).to.deep.equal({});
    });
    it ('1502', () => {
      expect(Either({}).raw({}, images)).to.deep.equal(images);
    });
    it ('1503', () => {
      expect(Either(images).raw({}, images)).to.deep.equal(images);
    });
  });
  describe('fromNullable', function() {
    it ('1550', () => {
      expect(fromNullable(null).raw(null, images)).to.deep.equal(null);
    });
    it ('1551', () => {
      expect(fromNullable(null).raw({}, images)).to.deep.equal({});
    });
    it ('1552', () => {
      expect(fromNullable({}).raw({}, images)).to.deep.equal(images);
    });
    it ('1553', () => {
      expect(fromNullable(images).raw({}, images)).to.deep.equal(images);
    });
  });
  describe('Left', function() {
    it ('1400', () => {
      expect(Left(images).raw({}, images)).to.deep.equal({});
    });
  });

  describe('Right', function() {
    it ('1300', () => {
      expect(Right(images).raw({}, images)).to.deep.equal(images);
    });
  });

  describe('inArray', function() {
    it ('1200', () => {
      expect(inArray(404, [500, 404])).to.be.equal(true);
    });
    it ('1201', () => {
      expect(inArray(2, [500, 404])).to.be.equal(false);
    });
  });

  describe('arrayCompare', function() {
    it ('1100', () => {
      expect(arrayCompare(images, 'updated_at')).to.be.equal(false);
    });
    it ('1101', () => {
      expect(arrayCompare(images, images)).to.be.equal(true);
    });
    it ('1102', () => {
      expect(arrayCompare([500, 404], [500, 404])).to.be.equal(true);
    });
    it ('1103', () => {
      expect(arrayCompare([500, 404], [500])).to.be.equal(false);
    });
  });

  describe('isFunction', function() {
    it ('1000', () => {
      expect(isFunction(null)).to.be.equal(false);
    });
    it ('1001', () => {
      expect(isFunction(console.log)).to.be.equal(true);
    });
  });

  describe('GrabStatus', function() {
    it ('900', () => {
      expect(GrabStatus(null, images)).to.be.equal(200);
    });
  });

  describe('GrabResult', function() {
    it ('800', () => {
      expect(GrabResult(null, images)).to.deep.equal(images);
    });
  });

  describe('Clean', function() {
    it ('700', () => {
      expect(Clean({a: null, b: 'b', c: 'c'})).to.be.equal(undefined);
    });
    it ('701', () => {
      let test = {
        test1: null,
        test2: 'somestring',
        test3: 3,
      };
      Clean(test);
      expect(test).to.deep.equal({test2: 'somestring', test3: 3});
    });
  });

  describe('Emptyable', function() {
    it ('600', () => {
      expect(Emptyable({}, images).raw({}, images)).to.be.equal(images);
    });
    it ('601', () => {
      expect(Emptyable(new Buffer('A'), images).raw(new Buffer('A'), images)).to.deep.equal(new Buffer('A'));
    });
    it ('602', () => {
      expect(Emptyable(images, images).raw(images, images)).to.deep.equal(images);
    });
    it ('603', () => {
      expect(Emptyable([{}], images).raw([{}], images)).to.deep.equal(images);
    });
    it ('604', () => {
      expect(Emptyable([], images).raw([], images)).to.deep.equal(images);
    });
    it ('605', () => {
      expect(Emptyable(null, images).raw(null, images)).to.deep.equal(images);
    });
    it ('606', () => {
      expect(Emptyable(/.*/, images).raw(/.*/, images)).to.deep.equal(/.*/);
    });
    it ('607', () => {
      expect(Emptyable(function() {}, images).raw(function() {}, images)).to.deep.equal(images);
    });
    it ('608', () => {
      expect(Emptyable(1234, images).raw(1234, images)).to.deep.equal(1234);
    });
    it ('609', () => {
      expect(Emptyable(1234.345, images).raw(1234.345, images)).to.deep.equal(1234.345);
    });
    it ('610', () => {
      expect(Emptyable('Hola', images).raw('Hola', images)).to.deep.equal('Hola');
    });
    it ('611', () => {
      expect(Emptyable('', images).raw('', images)).to.deep.equal(images);
    });
    it ('612', () => {
      expect(Emptyable('', images).raw('', images)).to.deep.equal(images);
    });
    it ('613', () => {
      expect(Emptyable(true, images).raw(true, images)).to.deep.equal(true);
    });
    it ('614', () => {
      expect(Emptyable(false, images).raw(false, images)).to.deep.equal(false);
    });
    it ('615', () => {
      expect(Emptyable(undefined, images).raw(undefined, images)).to.deep.equal(images);
    });
  });


  describe('FlipEmpty', function() {
    it ('500', () => {
      expect(FlipEmpty({}, images)).to.be.equal(images);
    });
    it ('501', () => {
      expect(FlipEmpty(new Buffer('A'), images)).to.deep.equal(new Buffer('A'));
    });
    it ('502', () => {
      expect(FlipEmpty(images, images)).to.deep.equal(images);
    });
    it ('503', () => {
      expect(FlipEmpty([{}], images)).to.deep.equal(images);
    });
    it ('504', () => {
      expect(FlipEmpty([], '404 - Not found')).to.be.equal('404 - Not found');
    });
    it ('505', () => {
      expect(FlipEmpty(null, images)).to.deep.equal(images);
    });
    it ('506', () => {
      expect(FlipEmpty(/.*/, images)).to.deep.equal(/.*/);
    });
    it ('507', () => {
      expect(FlipEmpty(function() {}, images)).to.deep.equal(images);
    });
    it ('508', () => {
      expect(FlipEmpty(1234, images)).to.deep.equal(1234);
    });
    it ('509', () => {
      expect(FlipEmpty(1234.345, images)).to.deep.equal(1234.345);
    });
    it ('510', () => {
      expect(FlipEmpty('Hola', images)).to.deep.equal('Hola');
    });
    it ('511', () => {
      expect(FlipEmpty('', images)).to.deep.equal(images);
    });
    it ('512', () => {
      expect(FlipEmpty('', images)).to.deep.equal(images);
    });
    it ('513', () => {
      expect(FlipEmpty(true, images)).to.deep.equal(true);
    });
    it ('514', () => {
      expect(FlipEmpty(false, images)).to.deep.equal(false);
    });
    it ('515', () => {
      expect(FlipEmpty(undefined, images)).to.deep.equal(images);
    });
    it ('515', () => {
      expect(FlipEmpty(null, null)).to.deep.equal(null);
    });
  });

  describe('NullifyEmpty', function() {
    it ('520', () => {
      expect(NullifyEmpty({})).to.be.equal(null);
    });
    it ('521', () => {
      expect(NullifyEmpty(new Buffer('A'))).to.deep.equal(new Buffer('A'));
    });
    it ('522', () => {
      expect(NullifyEmpty(images)).to.deep.equal(images);
    });
    it ('523', () => {
      expect(NullifyEmpty([{}])).to.equal(null);
    });
    it ('524', () => {
      expect(NullifyEmpty([])).to.be.equal(null);
    });
    it ('525', () => {
      expect(NullifyEmpty(null)).to.equal(null);
    });
    it ('526', () => {
      expect(NullifyEmpty(/.*/)).to.deep.equal(/.*/);
    });
    it ('527', () => {
      expect(NullifyEmpty(function() {})).to.equal(null);
    });
    it ('528', () => {
      expect(NullifyEmpty(1234)).to.equal(1234);
    });
    it ('529', () => {
      expect(NullifyEmpty(1234.345)).to.equal(1234.345);
    });
    it ('530', () => {
      expect(NullifyEmpty('Hola')).to.equal('Hola');
    });
    it ('531', () => {
      expect(NullifyEmpty('')).to.equal(null);
    });
    it ('532', () => {
      expect(NullifyEmpty('')).to.equal(null);
    });
    it ('533', () => {
      expect(NullifyEmpty(true)).to.equal(true);
    });
    it ('534', () => {
      expect(NullifyEmpty(false)).to.equal(false);
    });
    it ('535', () => {
      expect(NullifyEmpty(undefined)).to.equal(null);
    });
    it ('535', () => {
      expect(NullifyEmpty(null)).to.equal(null);
    });
  });

  describe('EnforcedParameter', function() {
    it ('300', () => {
      expect(EnforcedParameter(req, res, 'what', 'params')).to.deep.equal({parameter_required: 'what'});
    });
    it ('301', () => {
      expect(EnforcedParameter(req, res, 'a', 'params')).to.be.equal(false);
    });
    it ('302', () => {
      expect(EnforcedParameter(req, res, 'a', 'body')).to.be.equal(false);
    });
    it ('303', () => {
      expect(EnforcedParameter(req, res, 'a')).to.be.equal(false);
    });
    it ('304', () => {
      expect(EnforcedParameter(req, res, '1')).to.deep.equal({parameter_required: '1'});
    });
  });

  describe('MissingParameters', function() {
    it ('200', () => {
      expect(MissingParameters(req, res, ['eid', 'type', 'order', 'alt', 'name'])).to.be.equal(true);
    });
    it ('201', () => {
      expect(MissingParameters(req, res, ['a', 'b', 'c'])).to.be.equal(false);
    });
  });

  describe('MissingKeys', function() {
    it ('100', () => {
      expect(MissingKeys(['D'], {A: 'hola', b: 'A', c: 'A'}, 'ERR')).to.deep.equal(['D']);
    });
    it ('101', () => {
      expect(MissingKeys(['A'], {A: 'hola', b: 'A', c: 'A'}, 'ERR').length).to.be.equal(0);
    });
    it ('102', () => {
      expect(MissingKeys(['A'], {A: 'hola', b: 'A', c: 'A'}, 'ERR')).to.deep.equal([]);
    });
    it ('103', () => {
      expect(MissingKeys(['A', 'b', 'c'], {A: 'hola', b: 'A', c: 'A'}, 'ERR')).to.deep.equal([]);
    });
    it ('104', () => {
      expect(MissingKeys(['1', '2', '3'], ['A', 'B', 'C'], 'ERR')).to.deep.equal(['1', '2', '3']);
    });
  });


  describe('Resolve', function() {
    it ('1', () => {
      expect(Resolve(null, images)).to.be.equal(images);
    });
    it ('2', () => {
      expect(Resolve('error', images)).to.be.equal('error');
    });
    it ('3', () => {
      expect(Resolve('error', null)).to.be.equal('error');
    });
    it ('4', () => {
      expect(Resolve(null, null)).to.be.equal('404 - Not found');
    });
    it ('5', () => {
      expect(Resolve(null, [])).to.be.equal('404 - Not found');
    });
  });

  describe('isObject', function() {
    it ('12', () => {
      expect(isObject({})).to.be.equal(true);
    }); // Will return: true
    it ('12.1', () => {
      expect(isObject(new Buffer('A'))).to.be.equal(false);
    }); // Will return: true
    it ('12.2', () => {
      expect(isObject(images)).to.be.equal(false);
    }); // Will return: false
    it ('13', () => {
      expect(isObject([])).to.be.equal(false);
    }); // Will return: false
    it ('14', () => {
      expect(isObject(null)).to.be.equal(false);
    }); // Will return: false
    it ('15', () => {
      expect(isObject(/.*/)).to.be.equal(false);
    }); // Will return: false
    it ('16', () => {
      expect(isObject(function() {})).to.be.equal(false);
    }); // Will return: false
    it ('17', () => {
      expect(isObject(1234)).to.be.equal(false);
    }); // Will return: false
    it ('18', () => {
      expect(isObject(1234.345)).to.be.equal(false);
    }); // Will return: false
    it ('19', () => {
      expect(isObject('Hola')).to.be.equal(false);
    }); // Will return: false
    it ('20', () => {
      expect(isObject('')).to.be.equal(false);
    }); // Will return: false
    it ('21', () => {
      expect(isObject(true)).to.be.equal(false);
    }); // Will return: false
  });

  describe('NullBehavior', function() {
    it ('22', () => {
      expect(val != null && val[0] != null).to.be.equal(false);
    });
    it ('23', () => {
      expect(val !== null && val[0] !== null).to.be.equal(true);
    });
    it ('24', () => {
      expect(val == null).to.be.equal(false);
    });
    it ('25', () => {
      expect(val[0] == null).to.be.equal(true);
    });
    it ('26', () => {
      expect(val === null).to.be.equal(false);
    });
    it ('27', () => {
      expect(val[0] == null).to.be.equal(true);
    });
  });

  describe('Errable', function() {
    it ('40', () => {
      expect(Errable({}, {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('41', () => {
      expect(Errable(new Buffer('A'), {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 200
    it ('42', () => {
      expect(Errable(images, {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('43', () => {
      expect(Errable([], {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('44', () => {
      expect(Errable(null, {hola: 'hola'}).raw(500, 200)).to.be.equal(200);
    }); // Will return: 200
    it ('45', () => {
      expect(Errable(/.*/, {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('46', () => {
      expect(Errable(function() {}, {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('47', () => {
      expect(Errable(1234, {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('48', () => {
      expect(Errable(1234.345, {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('49', () => {
      expect(Errable('Hola', {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('49.5', () => {
      expect(Errable('', {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
    it ('49.7', () => {
      expect(Errable(true, {hola: 'hola'}).raw(500, 200)).to.be.equal(500);
    }); // Will return: 500
  });

  describe('HasContent', function() {
    it ('{}                40', () => {
      expect(HasContent({}, images) .raw(500, 'yes')).to.be.equal(500);
    }); // Will return: 'yes
    it ('new Buffer(\'A\')   41', () => {
      expect(HasContent(new Buffer('A'), images) .raw(500, 'yes')).to.be.equal('yes');
    }); // Will return: true
    it ('{hola:\'hola\'}     42', () => {
      expect(HasContent(images, images) .raw(500, 'yes')).to.be.equal('yes');
    }); // Will return: false
    it ('[]                43', () => {
      expect(HasContent([], images) .raw(500, 'yes')).to.be.equal(500);
    }); // Will return: false
    it ('[{}]              44', () => {
      expect(HasContent([{}], images) .raw(500, 'yes')).to.be.equal(500);
    }); // Will return: false
    it ('null              45', () => {
      expect(HasContent(null, images) .raw(500, 'yes')).to.be.equal(500);
    }); // Will return: false
    it ('/.*/              46', () => {
      expect(HasContent(/.*/, images) .raw(500, 'yes')).to.be.equal('yes');
    }); // Will return: false
    it ('function () {})   47', () => {
      expect(HasContent(function() { }, images) .raw(500, 'yes')).to.be.equal(500);
    }); // Will return: false
    it ('1234              48', () => {
      expect(HasContent(1234, images) .raw(500, 'yes')).to.be.equal('yes');
    }); // Will return: false
    it ('1234.345          49', () => {
      expect(HasContent(1234.345, images) .raw(500, 'yes')).to.be.equal('yes');
    }); // Will return: false
    it ('\'Hola\'            51', () => {
      expect(HasContent('Hola', images) .raw(500, 'yes')).to.be.equal('yes');
    }); // Will return: false
    it (' ""               52', () => {
      expect(HasContent('', images) .raw(500, 'yes')).to.be.equal(500);
    }); // Will return: false
    it (' \'\'               53', () => {
      expect(HasContent('', images) .raw(500, 'yes')).to.be.equal(500);
    }); // Will return: false
    it (' true             54', () => {
      expect(HasContent(true, images) .raw(500, 'yes')).to.be.equal('yes');
    }); // Will return: false
    it ('false             55', () => {
      expect(HasContent(false, images) .raw(500, 'yes')).to.be.equal('yes');
    }); // Will return: false
    it ('{}, vs {hola:}    56', () => {
      expect(HasContent({}, {hola: 'hola'}) .raw(500, 'yes')).to.be.equal(500);
    }); // Will return: 500
  });

  describe('NotFound', function() {
    it ('{}                60', () => {
      expect(NotFound({}).raw(404, 200)).to.be.equal(404);
    }); // Will return: 200
    it ('new Buffer(\'A\')   61', () => {
      expect(NotFound(new Buffer('A')).raw(404, 200)).to.be.equal(200);
    }); // Will return: true
    it ('{hola:\'hola\'}     62', () => {
      expect(NotFound(images).raw(404, 200)).to.be.equal(200);
    }); // Will return: false
    it ('[]                63', () => {
      expect(NotFound([]).raw(404, 200)).to.be.equal(404);
    }); // Will return: false
    it ('[{}]              64', () => {
      expect(NotFound([{}]).raw(404, 200)).to.be.equal(404);
    }); // Will return: false
    it ('null              65', () => {
      expect(NotFound(null).raw(404, 200)).to.be.equal(404);
    }); // Will return: false
    it ('/.*/              66', () => {
      expect(NotFound(/.*/).raw(404, 200)).to.be.equal(200);
    }); // Will return: false
    it ('function () {})   67', () => {
      expect(NotFound(function() {}).raw(404, 200)).to.be.equal(404);
    }); // Will return: false
    it ('1234              68', () => {
      expect(NotFound(1234).raw(404, 200)).to.be.equal(200);
    }); // Will return: false
    it ('1234.345          69', () => {
      expect(NotFound(1234.345).raw(404, 200)).to.be.equal(200);
    }); // Will return: false
    it ('\'Hola\'            70', () => {
      expect(NotFound('Hola').raw(404, 200)).to.be.equal(200);
    }); // Will return: false
    it (' ""               71', () => {
      expect(NotFound('').raw(404, 200)).to.be.equal(404);
    }); // Will return: false
    it (' \'\'               72', () => {
      expect(NotFound('').raw(404, 200)).to.be.equal(404);
    }); // Will return: false
    it (' true             73', () => {
      expect(NotFound(true).raw(404, 200)).to.be.equal(200);
    }); // Will return: false
    it ('false             74', () => {
      expect(NotFound(false).raw(404, 200)).to.be.equal(200);
    }); // Will return: false
  });

  describe('isEmpty', function() {
    it ('{}               80', () => {
      expect(isEmpty({})).to.be.equal(true);
    }); // Will return: true
    it ('new Buffer(\'A\')  81', () => {
      expect(isEmpty(new Buffer('A'))).to.be.equal(false);
    }); // Will return: false
    it ('{hola:\'hola\'}    82', () => {
      expect(isEmpty(images)).to.be.equal(false);
    }); // Will return: false
    it ('[{}]             82.5', () => {
      expect(isEmpty([{}])).to.be.equal(true);
    }); // Will return: true
    it ('[]               83', () => {
      expect(isEmpty([])).to.be.equal(true);
    }); // Will return: true
    it ('null             84', () => {
      expect(isEmpty(null)).to.be.equal(true);
    }); // Will return: true
    it ('/.*/             85', () => {
      expect(isEmpty(/.*/)).to.be.equal(false);
    }); // Will return: false
    it ('function () {})  86', () => {
      expect(isEmpty(function() {})).to.be.equal(true);
    }); // Will return: true
    it ('1234             87', () => {
      expect(isEmpty(1234)).to.be.equal(false);
    }); // Will return: false
    it ('1234.345         88', () => {
      expect(isEmpty(1234.345)).to.be.equal(false);
    }); // Will return: false
    it ('\'Hola\'           89', () => {
      expect(isEmpty('Hola')).to.be.equal(false);
    }); // Will return: false
    it (' ""              90', () => {
      expect(isEmpty('')).to.be.equal(true);
    }); // Will return: true
    it (' \'\'              91', () => {
      expect(isEmpty('')).to.be.equal(true);
    }); // Will return: true
    it (' true            92', () => {
      expect(isEmpty(true)).to.be.equal(false);
    }); // Will return: false
    it ('false            93', () => {
      expect(isEmpty(false)).to.be.equal(false);
    }); // Will return: false
    it ('undefined        94', () => {
      expect(isEmpty(undefined)).to.be.equal(true);
    }); // Will return: true
  });
});
