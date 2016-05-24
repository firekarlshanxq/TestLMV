/**
 * Created by t_shanx on 5/24/2016.
 */

XiqiaoShanFirstExtension = function (viewer,options) {
    Autodesk.Viewing.Extension.call(this,viewer,options);
    _self = this;
    _self.load = function () {
        console.log("XiqiaoShanFirstExtension loaded");
        return true;
    };
    
    _self.unload = function () {
        console.log("XiqiaoShanFirstExtension unloaded");
        return true;
    };
    
};

XiqiaoShanFirstExtension.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

XiqiaoShanFirstExtension.prototype.constructor =
    XiqiaoShanFirstExtension;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'XiqiaoShanFirstExtension',
    XiqiaoShanFirstExtension);

