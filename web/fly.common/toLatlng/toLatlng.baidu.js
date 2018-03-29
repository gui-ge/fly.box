window.initToLatlng = function () {
    // 百度地图API功能
    var map = new BMap.Map("map_canvas");
    map.enableScrollWheelZoom();
    map.enableInertialDragging();
    map.addControl(new BMap.NavigationControl());
    window.map = map;

    // 设置默认的位置
    setMarker('114.033933', '22.537781');

    var marker = null;
    var myGeo = new BMap.Geocoder();
    // 自动填充
    new BMap.Autocomplete({ "input": "address" });

    // 获取城市信息
    var city = new BMap.LocalCity();
    city.get(function (data) {
        var lng = data.center.lng;
        var lat = data.center.lat;
        $('#lng').val(lng);
        $('#endAddress').html(data.name);
        $('#lat').val(lat);
        setMarker(lng, lat);
        window.onLocalData && window.onLocalData(data)
    });

    // 拖动解析
    $('#address').live('change', function () {
        var addr = $(this).val();
        toLatlng(addr);
    });

    // 点击进行解析
    $('#geocodeBtn').click(function (e) {
        var addr = $('#address').val();
        if (addr) {
            toLatlng(addr);
        }

        e.stopImmediatePropagation();
    });


    // 鼠标滑动
    map.addEventListener('mousemove', function (e) {
        var nx = e.offsetX;
        var ny = e.offsetY;
        $('#overTip').html(e.point.lng + ',' + e.point.lat + '<br >' + nx + 'px,' + ny + 'px')
            .css({ 'left': nx + 8, 'top': ny + 8 });
    });

    // 鼠标进入地图区域
    map.addEventListener('mouseover', function (e) {
        $('#overTip').show();
    });

    // 鼠标离开地图区域
    map.addEventListener('mouseout', function (e) {
        $('#overTip').hide();
    });
    function setMarker(lng, lat) {

        var point = new BMap.Point(lng, lat);

        map.centerAndZoom(point, 18);

        marker = new BMap.Marker(point);
        marker.enableDragging();
        map.addOverlay(marker);

        marker.addEventListener("dragend", function () {
            var cp = this.getPosition();
            toAddr(cp);

            $('#lat').val(cp.lat);
            $('#lng').val(cp.lng);
        });

        marker.addEventListener("dragstart", function () {
            $('#lat').val('拖动中..');
            $('#lng').val('拖动中..');
            $('#endAddress').html('拖动中...');
        });
    }

    function toLatlng(addr) {
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(addr, function (point) {
            if (point) {
                $('#lat').val(point.lat);
                $('#lng').val(point.lng);
                $('#endAddress').html(addr);

                map.centerAndZoom(point, 18);
                marker.setPosition(point);
                window.onLocalData && window.onLocalData({ center: point, name: addr })
            }
        });
    }

    function toAddr(point) {
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getLocation(point, function (res) {
            if (res) {
                $('#lat').val(point.lat);
                $('#lng').val(point.lng);
                $('#endAddress').html(res.address);
            }
        });
    }
}