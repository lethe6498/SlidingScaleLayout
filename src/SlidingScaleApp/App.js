import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SlidingScaleLayout = () => {
    const [currentIndex, setCurrentIndex] = useState(2);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // 为每个item创建动画值
    const animatedValues = useRef(
        Array.from({ length: 5 }, () => ({
            scale: new Animated.Value(0.6),
            translateX: new Animated.Value(0),
            opacity: new Animated.Value(1),
        }))
    ).current;

    const items = [
        { id: 0, color: '#ff6b6b', label: '1' },
        { id: 1, color: '#4ecdc4', label: '2' },
        { id: 2, color: '#45b7d1', label: '3' },
        { id: 3, color: '#f9ca24', label: '4' },
        { id: 4, color: '#6c5ce7', label: '5' },
    ];

    // 自动播放
    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [isAutoPlay, items.length]);

    // 动画效果
    useEffect(() => {
        const animations = items.map((_, index) => {
            let offset = index - currentIndex;
            if (offset > items.length / 2) offset -= items.length;
            if (offset < -items.length / 2) offset += items.length;

            let scale, translateX, opacity;

            if (offset === 0) {
                // 中间项 - 大尺寸，居中
                scale = 1.4;
                translateX = 0;
                opacity = 1;
            } else if (offset === -1) {
                // 左侧项 - 小尺寸，向左移动
                scale = 0.6;
                translateX = -120;
                opacity = 1;
            } else if (offset === 1) {
                // 右侧项 - 小尺寸，向右移动
                scale = 0.6;
                translateX = 120;
                opacity = 1;
            } else {
                // 不可见项
                scale = 0.3;
                translateX = offset > 0 ? 240 : -240;
                opacity = 0;
            }

            return Animated.parallel([
                Animated.timing(animatedValues[index].scale, {
                    toValue: scale,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValues[index].translateX, {
                    toValue: translateX,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValues[index].opacity, {
                    toValue: opacity,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]);
        });

        Animated.parallel(animations).start();
    }, [currentIndex]);

    const handleItemPress = (index) => {
        setCurrentIndex(index);
        setIsAutoPlay(false);
    };

    const toggleAutoPlay = () => {
        setIsAutoPlay(!isAutoPlay);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            {/* 头部 */}
            <View style={styles.header}>
                <Text style={styles.title}>滑动缩放效果</Text>
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: isAutoPlay ? '#ff6b6b' : '#4ecdc4' }
                    ]}
                    onPress={toggleAutoPlay}
                >
                    <Text style={styles.buttonText}>
                        {isAutoPlay ? '停止自动播放' : '开始自动播放'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 项目容器 */}
            <View style={styles.itemsContainer}>
                {items.map((item, index) => {
                    let offset = index - currentIndex;
                    if (offset > items.length / 2) offset -= items.length;
                    if (offset < -items.length / 2) offset += items.length;

                    const isVisible = Math.abs(offset) <= 1;

                    return (
                        <Animated.View
                            key={item.id}
                            style={[
                                styles.item,
                                {
                                    backgroundColor: item.color,
                                    transform: [
                                        { scale: animatedValues[index].scale },
                                        { translateX: animatedValues[index].translateX },
                                    ],
                                    opacity: animatedValues[index].opacity,
                                    zIndex: offset === 0 ? 10 : 1,
                                    display: isVisible ? 'flex' : 'none',
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.itemTouchable}
                                onPress={() => handleItemPress(index)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemLabel}>{item.label}</Text>
                                    <Text style={styles.itemNumber}>{index + 1}</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </View>

            {/* 指示器 */}
            <View style={styles.indicators}>
                {items.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.indicator,
                            {
                                backgroundColor: index === currentIndex
                                    ? '#fff'
                                    : 'rgba(255,255,255,0.3)'
                            }
                        ]}
                        onPress={() => handleItemPress(index)}
                    />
                ))}
            </View>

            {/* 说明文字 */}
            <Text style={styles.instructions}>
                点击方块或指示器切换 • 显示三个并排方块，中间的会变大并覆盖两边
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 60, // 适配状态栏
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
        elevation: 2, // Android阴影
        shadowColor: '#000', // iOS阴影
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: screenWidth * 0.8,
        height: screenHeight * 0.6,
        position: 'relative',
    },
    item: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 20,
        elevation: 8, // Android阴影
        shadowColor: '#000', // iOS阴影
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    itemTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContent: {
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    itemNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        opacity: 0.8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    indicators: {
        position: 'absolute',
        bottom: 80,
        flexDirection: 'row',
        gap: 8,
    },
    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    instructions: {
        position: 'absolute',
        bottom: 40,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        fontSize: 14,
        paddingHorizontal: 20,
    },
});