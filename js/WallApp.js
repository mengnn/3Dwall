var Effects = [];
var EffectsType = {};
for (var i = 0, len = WX3DWallSetting.ShowTypes.length; i < len; i++) {
  switch (WX3DWallSetting.ShowTypes[i]) {
    case 0:
      Effects.push({ type: 'sphere', range: 2400 });
      EffectsType.sphere = true;
      break;
    case 10:
      Effects.push({ type: 'helix', range: 2200 });
      EffectsType.helix = true;
      break;
    case 20:
      Effects.push({ type: 'grid', range: 2400 });
      EffectsType.grid = true;
      break;
    case 30:
      Effects.push({ type: 'table', range: WX3DWallSetting.AreaSize + 2000 });
      EffectsType.table = true;
      break;
  }
}

var getEffects = function (typename) {
  var EffectOne;
  for (var i = Effects.length; i--;) {
    var tmp = Effects[i];
    if (tmp && tmp.type === typename) {
      EffectOne = tmp;
    }
  }
  return EffectOne;
}
//getEffects('sphere');

var table = [];
if (WX3DWallSetting.LogoSetting) {
  var logoSetting = WX3DWallSetting.LogoSetting.replace(/(x|y)/gi, '"$1"');
  if (logoSetting === "[]") {
    logoSetting = "[{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1},{x:6, y:1}, {x:7, y:1}, {x:8, y:1}, {x:14, y:1}, {x:15, y:1},{x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}, {x:5, y:2},{x:6, y:2}, {x:7, y:2}, {x:8, y:2}, {x:13, y:2}, {x:14, y:2},{x:15, y:2}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3}, {x:14, y:3}, {x:15, y:3},{x:7, y:4}, {x:8, y:4}, {x:14, y:4}, {x:15, y:4}, {x:7, y:5},{x:8, y:5}, {x:14, y:5}, {x:15, y:5}, {x:6, y:6}, {x:7, y:6},{x:8, y:6}, {x:14, y:6}, {x:15, y:6}, {x:1, y:7}, {x:2, y:7},{x:3, y:7}, {x:4, y:7}, {x:5, y:7}, {x:6, y:7}, {x:7, y:7},{x:8, y:7}, {x:14, y:7}, {x:15, y:7}, {x:1, y:8}, {x:2, y:8},{x:3, y:8}, {x:4, y:8}, {x:5, y:8}, {x:6, y:8}, {x:7, y:8},{x:8, y:8}, {x:14, y:8}, {x:15, y:8}, {x:6, y:9}, {x:7, y:9},{x:8, y:9}, {x:14, y:9}, {x:15, y:9}, {x:7, y:10}, {x:8, y:10},{x:14, y:10}, {x:15, y:10}, {x:7, y:11}, {x:8, y:11}, {x:14, y:11},{x:15, y:11}, {x:6, y:12}, {x:7, y:12}, {x:8, y:12}, {x:14, y:12},{x:15, y:12}, {x:1, y:13}, {x:2, y:13}, {x:3, y:13}, {x:4, y:13},{x:5, y:13}, {x:6, y:13}, {x:7, y:13}, {x:8, y:13}, {x:14, y:13},{x:15, y:13}, {x:1, y:14}, {x:2, y:14}, {x:3, y:14}, {x:4, y:14},{x:5, y:14}, {x:6, y:14}, {x:7, y:14}, {x:8, y:14}, {x:13, y:14},{x:14, y:14}, {x:15, y:14}, {x:16, y:14}]".replace(/(x|y)/gi, '"$1"');
  }
  table = JSON.parse(logoSetting);
  console.log(table)
}


var fps = 30;
//fps = 1;





var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };


function init() {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;

  scene = new THREE.Scene();

  // table
  //if (EffectsType.table) {
  if (true) {
    var maxX = 0, maxY = 0;
    var minX = 999, minY = 999;
    for (var i = table.length; i--;) {
      var coords = table[i];
      if (coords.x > maxX) {
        maxX = coords.x;
      }
      if (coords.y > maxY) {
        maxY = coords.y;
      }
      if (coords.x < minX) {
        minX = coords.x;
      }
      if (coords.y < minY) {
        minY = coords.y;
      }
    }
    var delX = maxX - minX + 1, delY = maxY - minY + 1;

    for (var i = 0, len = table.length; i < len; i++) {
      var element = document.createElement('div');
      element.className = 'element';
      element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
      element.style.fontSize = "100px";
      // element.innerHTML = table[i].x + "," + table[i].y;
      //alert(WX3DWallSetting.LogoType)
      if (WX3DWallSetting.LogoType == 10) {
        var img = document.createElement('img');
        //img.src = fileDomain + WX3DWallSetting.CustomImage;
        //随机生成照片
        img.src = 'images/'+parseInt(Math.random()*8+1,10)+'.jpg';
        img.style.width = '100%';
        img.style.opacity=(Math.random() * 0.5 + 0.25);
        img.style.height = '100%';
        element.appendChild(img);
      }

      var object = new THREE.CSS3DObject(element);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);

      objects.push(object);

      var object = new THREE.Object3D();

      object.position.x = (table[i].x * 140) - (minX - 1 + delX / 2) * 140 - 70;
      object.position.y = -(table[i].y * 180) + (minY - 1 + delY / 2) * 180 + 90;

      targets.table.push(object);
    }

    if (EffectsType.table) {
      var effectone = getEffects("table");
      var ratio = 1;
      var delMax = maxX - minX;
      if (delMax < maxY - minY) {
        delMax = maxY - minY;
      }
      if (delMax > 60) {
        ratio = (~~((((delMax - 60) * 3 / 100) + 1) * 100)) / 100;
      }
      effectone.range = (WX3DWallSetting.AreaSize + 2000) * ratio;
      //console.log(effectone);
    }


    //console.log("minX" + minX + "," + "minY" + minY + "," + "maxX" + maxX + "," + "maxY" + maxY);
    //if (true) {
    //  var element = document.createElement('div');
    //  element.className = 'element';
    //  element.style.backgroundColor = 'rgba(255,0,0,' + (Math.random() * 0.5 + 0.25) + ')';
    //  element.style.fontSize = "100px";
    //  if (WX3DWallSetting.LogoType == 10) {
    //    var img = document.createElement('img');
    //    img.src = 'http://newfile.31huiyi.com' + WX3DWallSetting.CustomImage;
    //    img.style.width = '100%';
    //    img.style.height = '100%';
    //    element.appendChild(img);
    //  }
    //  var object = new THREE.CSS3DObject(element);
    //  object.position.x = Math.random() * 4000 - 2000;
    //  object.position.y = Math.random() * 4000 - 2000;
    //  object.position.z = Math.random() * 4000 - 2000;
    //  scene.add(object);
    //  objects.push(object);
    //  var object = new THREE.Object3D();
    //  object.position.x = 0;
    //  object.position.y = 0;
    //  targets.table.push(object);
    //}
  }

  // sphere
  if (EffectsType.sphere) {
    var vector = new THREE.Vector3();

    // 锟斤拷锟斤拷锟斤拷远锟斤拷锟斤拷
    var effectone = getEffects("sphere");
    // 默锟斤拷锟斤拷锟斤拷为240
    var tablelen = table.length;
    var sphereRatio = 100;
    if (tablelen < 240) {
      effectone.range = 2400;

    } else {
      sphereRatio = ~~(tablelen / 240 * 100);
      effectone.range = ~~(2400 * sphereRatio / 100);
    }
    var baseWidth = 800;
    baseWidth = ~~(baseWidth * sphereRatio / 100);

    for (var i = 0, l = objects.length; i < l; i++) {
      var phi = Math.acos(-1 + (2 * i) / l);
      var theta = Math.sqrt(l * Math.PI) * phi;
      var object = new THREE.Object3D();

      object.position.x = baseWidth * Math.cos(theta) * Math.sin(phi);
      object.position.y = baseWidth * Math.sin(theta) * Math.sin(phi);
      object.position.z = baseWidth * Math.cos(phi);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);

      targets.sphere.push(object);
    }
  }

  // helix
  if (EffectsType.helix) {
    var vector = new THREE.Vector3();
    for (var i = 0, l = objects.length; i < l; i++) {
      var phi = i * 0.175 + Math.PI;

      var object = new THREE.Object3D();

      object.position.x = 900 * Math.sin(phi);
      object.position.y = -(i * 8) + 450;
      object.position.z = 900 * Math.cos(phi);

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;

      object.lookAt(vector);

      targets.helix.push(object);
    }
  }

  // grid
  if (EffectsType.grid) {
    for (var i = 0; i < objects.length; i++) {
      var object = new THREE.Object3D();

      object.position.x = ((i % 5) * 400) - 800;
      object.position.y = (-(~~(i / 5) % 5) * 400);
      object.position.z = (~~(i / 25)) * 1000 - 2000;

      targets.grid.push(object);
    }
  }

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  document.getElementById('container').appendChild(renderer.domElement);

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 3;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener('change', render);

  window.addEventListener('resize', onWindowResize, false);
}

function transform(targets, duration) {
  TWEEN.removeAll();

  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var target = targets[i];

    new TWEEN.Tween(object.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    //锟斤拷时锟津开ｏ拷锟斤拷知锟斤拷使锟斤拷锟斤拷锟斤拷
    new TWEEN.Tween(object.rotation)
      .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }


  //锟斤拷时锟津开ｏ拷锟斤拷知锟斤拷使锟斤拷锟斤拷锟斤拷
  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

var y = 400,
  MaxRange = 2500,
  t = 0;
function animate() {
  if (true) {

  }
  setTimeout(function () {
    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();

    //t = ++t % 360;
    t++;
    camera.position.set(MaxRange * Math.sin(t / 180), y, MaxRange * Math.cos(t / 180));
    camera.lookAt({ x: 0, y: 0, z: 0 });
    renderer.render(scene, camera);

    //console.log("animate %s", t);
  }, 1000 / fps);
}

function render() {
  renderer.render(scene, camera);
}


init();
animate();


if (!EffectsType.table) {

}



$(function () {
  var innerTimer = null;



  setInterval(function () {
    clearInterval(innerTimer);
    var randomEffect = Effects[Math.floor(Math.random() * Effects.length)];



    transform(targets[randomEffect.type], 2400);

    innerTimer = setInterval(function () {
      //if (MaxRange > randomEffect.range) {
      //  MaxRange -= 5;
      //} else if (MaxRange < randomEffect.range) {
      //  MaxRange += 5;
      //}
      //if (MaxRange !== randomEffect.range) {
      //  MaxRange = randomEffect.range;
      //}
      if (MaxRange > randomEffect.range) {
        var del = ~~((MaxRange - randomEffect.range) / 10);
        if (MaxRange - randomEffect.range < 10) {
          del = MaxRange - randomEffect.range;
        }
        MaxRange -= del;
      } else if (MaxRange < randomEffect.range) {
        var del = ~~((randomEffect.range - MaxRange) / 10);
        if (randomEffect.range - MaxRange < 10) {
          del = randomEffect.range - MaxRange;
        }
        MaxRange += del;
      }
    }, 3);
  }, WX3DWallSetting.ChangeSecond * 1000);

});
