import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const GoldenDivider = ({ width = 300, color = "#D4AF37" }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
            <Svg width={width} height={50} viewBox="0 0 300 50" fill="none">
                <Defs>
                    <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#D4AF37" stopOpacity="0" />
                        <Stop offset="0.5" stopColor="#D4AF37" stopOpacity="1" />
                        <Stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                {/* Center Group */}
                <G transform="translate(150, 25)">

                    {/* Central Diamond Shape */}
                    <Path
                        d="M0 -15 L12 0 L0 15 L-12 0 Z"
                        fill={color}
                    />
                    {/* Inner detail */}
                    <Path
                        d="M0 -8 L6 0 L0 8 L-6 0 Z"
                        fill="#FFFFFF"
                        fillOpacity="0.3"
                    />

                    {/* Left Scrollwork */}
                    <Path
                        d="M-12 0 C-18 -10 -30 -10 -40 0 C-30 10 -18 10 -12 0"
                        stroke={color}
                        strokeWidth="2"
                        fill="none"
                    />
                    {/* Top-Left Curve */}
                    <Path
                        d="M-12 0 Q-15 -15 -25 -10 Q-35 -5 -40 0"
                        stroke={color}
                        strokeWidth="2"
                        fill="none"
                    />
                    {/* Bottom-Left Curve */}
                    <Path
                        d="M-12 0 Q-15 15 -25 10 Q-35 5 -40 0"
                        stroke={color}
                        strokeWidth="2"
                        fill="none"
                    />

                    {/* Right Scrollwork (Mirrored) */}
                    <Path
                        d="M12 0 C18 -10 30 -10 40 0 C30 10 18 10 12 0"
                        stroke={color}
                        strokeWidth="2"
                        fill="none"
                    />
                    {/* Top-Right Curve */}
                    <Path
                        d="M12 0 Q15 -15 25 -10 Q35 -5 40 0"
                        stroke={color}
                        strokeWidth="2"
                        fill="none"
                    />
                    {/* Bottom-Right Curve */}
                    <Path
                        d="M12 0 Q15 15 25 10 Q35 5 40 0"
                        stroke={color}
                        strokeWidth="2"
                        fill="none"
                    />


                    {/* Left Dots (Graduating sizes) */}
                    <Circle cx="-48" cy="0" r="4" fill={color} />
                    <Circle cx="-58" cy="0" r="3" fill={color} />
                    <Circle cx="-66" cy="0" r="2" fill={color} />

                    {/* Right Dots (Graduating sizes) */}
                    <Circle cx="48" cy="0" r="4" fill={color} />
                    <Circle cx="58" cy="0" r="3" fill={color} />
                    <Circle cx="66" cy="0" r="2" fill={color} />
                </G>

                {/* Long Tapering Lines */}
                {/* Left Line */}
                <Path
                    d="M10 25 L 80 25"
                    stroke="url(#goldGrad)" // Use gradient for fading effect
                    strokeWidth="1.5"
                />

                {/* Right Line */}
                <Path
                    d="M220 25 L 290 25"
                    stroke="url(#goldGrad)"
                    strokeWidth="1.5"
                />
            </Svg>
        </View>
    );
};

export default GoldenDivider;
