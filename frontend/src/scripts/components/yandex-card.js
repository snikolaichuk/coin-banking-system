import ymaps from 'ymaps';

export function initMap(containerId, pointArr) {
    ymaps.ready(() => {
        var map = new ymaps.Map(containerId, {
            center: [59.91, 30.31],
            zoom: 11
        });

        pointArr.map(point => {
            map.geoObjects
            .add(new ymaps.Placemark([point.lat, point.lon], {
                balloonContent: 'Coin'
            }, {
                preset: 'islands#icon',
                iconColor: '#0095b6',
            }))
        })
    })

}
