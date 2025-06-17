import React, { useState, useEffect } from 'react';

const SlidingScaleLayout = () => {
const [currentIndex, setCurrentIndex] = useState(2);
const [isAutoPlay, setIsAutoPlay] = useState(true);

const items = [
{ id: 0, color: '#ff6b6b', label: '1' },
{ id: 1, color: '#4ecdc4', label: '2' },
{ id: 2, color: '#45b7d1', label: '3' },
{ id: 3, color: '#f9ca24', label: '4' },
{ id: 4, color: '#6c5ce7', label: '5' }
];

// 自动播放
useEffect(() => {
if (!isAutoPlay) return;

const interval = setInterval(() => {
setCurrentIndex(prev => (prev + 1) % items.length);
}, 1500);

return () => clearInterval(interval);
}, [isAutoPlay, items.length]);

const handleItemClick = (index) => {
setCurrentIndex(index);
setIsAutoPlay(false);
};

const getItemStyle = (offset) => {
const baseStyle = {
position: 'absolute',
left: '50%',
top: '50%',
transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

if (offset === 0) {
// 中间项 - 大尺寸，最高层级，居中
return {
...baseStyle,
transform: 'translate(-50%, -50%) scale(1.4) translateZ(0)',
zIndex: 10,
filter: 'brightness(1.2)',
opacity: 1
};
} else if (offset === -1) {
// 左侧项 - 小尺寸，向左移动
return {
...baseStyle,
transform: 'translate(-50%, -50%) translateX(-180px) scale(0.6) translateZ(0)',
zIndex: 1,
opacity: 1
};
} else if (offset === 1) {
// 右侧项 - 小尺寸，向右移动
return {
...baseStyle,
transform: 'translate(-50%, -50%) translateX(180px) scale(0.6) translateZ(0)',
zIndex: 1,
opacity: 1
};
} else {
// 不可见项
return {
...baseStyle,
transform: `translate(-50%, -50%) translateX(${offset > 0 ? 360 : -360}px) scale(0.3) translateZ(0)`,
zIndex: 0,
opacity: 0
};
}
};

return (
<div style={styles.container}>
  <div style={styles.header}>
    <h2 style={styles.title}>滑动缩放效果</h2>
    <button style={{ ...styles.button, backgroundColor: isAutoPlay ? '#ff6b6b' : '#4ecdc4' }} onClick={()=>
      setIsAutoPlay(!isAutoPlay)}
      >
      {isAutoPlay ? '停止自动播放' : '开始自动播放'}
    </button>
  </div>

  <div style={styles.itemsContainer}>
    {items.map((item, index) => {
    // 计算循环偏移
    let offset = index - currentIndex;
    if (offset > items.length / 2) offset -= items.length;
    if (offset < -items.length / 2) offset +=items.length; return ( <div key={item.id} style={{ ...styles.item,
      backgroundColor: item.color, ...getItemStyle(offset), visibility: Math.abs(offset) <=1 ? 'visible' : 'hidden' }}
      onClick={()=> handleItemClick(index)}
      >
      <div style={styles.itemContent}>
        <span style={styles.itemLabel}>{item.label}</span>
        <div style={styles.itemNumber}>{index + 1}</div>
      </div>
  </div>
  );
  })}
</div>

<div style={styles.indicators}>
  {items.map((_, index) => (
  <div key={index} style={{ ...styles.indicator, backgroundColor: index===currentIndex ? '#fff'
    : 'rgba(255,255,255,0.3)' }} onClick={()=> handleItemClick(index)}
    />
    ))}
  </div>

  <div style={styles.instructions}>
    点击方块或指示器切换 • 显示三个并排方块，中间的会变大并覆盖两边
  </div>
</div>
);
};

const styles = {
container: {
width: '100vw',
height: '100vh',
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
display: 'flex',
flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
fontFamily: 'Arial, sans-serif',
overflow: 'hidden'
},
header: {
position: 'absolute',
top: '2rem',
display: 'flex',
alignItems: 'center',
gap: '1rem'
},
title: {
color: 'white',
margin: 0,
fontSize: '1.5rem',
fontWeight: 'bold'
},
button: {
padding: '0.5rem 1rem',
border: 'none',
borderRadius: '25px',
color: 'white',
fontWeight: 'bold',
cursor: 'pointer',
transition: 'all 0.3s ease'
},
itemsContainer: {
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
width: '80vw',
height: '60vh',
perspective: '1000px'
},
item: {
width: '200px',
height: '200px',
margin: '0 -50px',
borderRadius: '20px',
cursor: 'pointer',
transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
border: '3px solid rgba(255,255,255,0.2)',
transformStyle: 'preserve-3d',
willChange: 'transform'
},
itemContent: {
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
color: 'white',
textShadow: '0 2px 4px rgba(0,0,0,0.3)'
},
itemLabel: {
fontSize: '1.2rem',
fontWeight: 'bold',
marginBottom: '0.5rem'
},
itemNumber: {
fontSize: '2rem',
fontWeight: 'bold',
opacity: 0.8
},
indicators: {
position: 'absolute',
bottom: '3rem',
display: 'flex',
gap: '0.5rem'
},
indicator: {
width: '12px',
height: '12px',
borderRadius: '50%',
cursor: 'pointer',
transition: 'all 0.3s ease'
},
instructions: {
position: 'absolute',
bottom: '1rem',
color: 'rgba(255,255,255,0.8)',
textAlign: 'center',
fontSize: '0.9rem'
}
};

export default SlidingScaleLayout;