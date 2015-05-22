var Site, WeedProxite, main, misc, argv;

WeedProxite = require('WeedProxite');

Site = WeedProxite.Site;

misc = WeedProxite.misc;

main = function(host, port) {
  var site;
  site = new Site(__dirname);
  site.use({
    mime: /javascript/i,
    host: /^getlantern\.org|ui\.getlantern\.org$/i,
    after:function (proxyRes,res,next,proxyReq,req) {
      proxyRes.withTextBody(function (err,body) {
        if (err) return next(err);
        // don't forget to call next()
        var hostname = req.host.split(':')[0];
        body = body.replace(
          '"s3.amazonaws.com":"MIRROR"',
          '"s3.amazonaws.com":"MIRROR","'+hostname+'":"MIRROR"'
        );
        body = body.replace(
          '"https://ui.getlantern.org/app/index.html"',
          '"./https://ui.getlantern.org/app/index.html"'
        );
        body = body.replace("COMETD_URL = loc && loc.protocol+'//'+loc.host+'/'+APP_MOUNT_POINT+'/'+COMETD_MOUNT_POINT",'COMETD_URL=loc && loc.protocol+"//"+loc.host+"/https://ui.getlantern.org/app/cometd"');
        body = body.replace(/\bhttps:\/\/lanternforum\.greatfire\.org\b/g,'/https://lanternforum.greatfire.org');
        proxyRes.body = body;
        next();
      });
    }
  });
  site.run(host, port);
  return site;
};

module.exports = main;
argv = process.argv;

/* Run as `node site.js localhost 8080` */
if (require.main === module) {  main(argv[2], argv[3]); }