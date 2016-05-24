/**
 * Created by t_shanx on 5/24/2016.
 */
function initialViewer() {
    var viewerContainer = document.getElementById('viewer');
    var viewer = new Autodesk.Viewing.Private.GuiViewer3D(
        viewerContainer,
        {extensions:['XiqiaoShanFirstExtension']}
    );
    viewer.start();
    
    Autodesk.Viewing.Document.load(
        function (document) {
            var rootItem = document.getRootItem();
            
            var geometryItems = 
                Autodesk.Viewing.Document.getSubItemsWithProperties(
                    rootItem,
                    {'type':'geometry','role': '3d'},
                    true
                );
            
            viewer.load(
                document.getViewablePath(geometryItems[0])
            );
        },
        
        function (msg) {
            console.log("Error: " + msg);
        }
    );
}

$(document).ready(function () {
        initialViewer();
    }
)