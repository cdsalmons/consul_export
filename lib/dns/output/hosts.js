var fs = require('fs');
var sep = require('path').sep;
var util = require('util');

var logger = require('../../util/logger.js').getLogger({'module': __filename});

module.exports = function(outputter_config) {

  var write_stream = fs.createWriteStream(outputter_config.path + sep + outputter_config.filename);

  return function(results, cb) {
    outputter_config.preamble && outputter_config.preamble.forEach(function(preamble) {
      write_stream.write(preamble);
      write_stream.write('\n');
    });

    results.forEach(function(result) {
      if (result.service) {
        write_stream.write(util.format('%s\t\t%s\n', result.address, result.service));
        write_stream.write(util.format('%s\t\t%s\n', result.address, result.service.replace(/\.([^.]*).consul/, '.consul')));
      } else if (result.node) {
        write_stream.write(util.format('%s\t\t%s\n', result.address, result.node));
      } else {
        logger.error("Invalid result: %s", util.inspect(result));
      }
    });

    write_stream.end(cb);
  }
};
