
import { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';

interface ProgressStepProps {
    id: string;
    label: string;
    type: 'start' | 'cp' | 'end';
    status: 'upcoming' | 'current' | 'done';
    hitIndex?: number;
    totalHits?: number;
    isLast: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
    id, label, type, status, hitIndex, totalHits, isLast,
}) => {
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (status === 'current') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulse, { toValue: 1.25, duration: 600, useNativeDriver: true }),
                    Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
                ]),
            ).start();
        } else {
            pulse.setValue(1);
        }
    }, [status]);

    const dotColor =
        status === 'done' ? '#22C55E' :
            status === 'current' ? '#F59E0B' :
                '#4B5563';

    const icon =
        type === 'start' ? '⚑' :
            type === 'end' ? '⚑' : '◉';

    return (
        <View style={stepStyles.row}>
            <View style={stepStyles.dotCol}>
                <Animated.View
                    style={[
                        stepStyles.dot,
                        { backgroundColor: dotColor, transform: [{ scale: status === 'current' ? pulse : 1 }] },
                    ]}
                >
                    <Text style={stepStyles.dotText}>{icon}</Text>
                </Animated.View>
                {!isLast && (
                    <View style={[stepStyles.line, { backgroundColor: status === 'done' ? '#22C55E' : '#374151' }]} />
                )}
            </View>

            <View style={stepStyles.labelCol}>
                <Text style={[stepStyles.labelId, status === 'done' && stepStyles.done, status === 'current' && stepStyles.current]}>
                    {label}
                    {totalHits && totalHits > 1 ? ` #${(hitIndex ?? 0) + 1}` : ''}
                </Text>
                <Text style={stepStyles.status}>
                    {status === 'done' ? '✓ Completed' : status === 'current' ? '← Head here' : 'Upcoming'}
                </Text>
            </View>
        </View>
    );
};

const stepStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 0
    },
    dotCol: {
        alignItems: 'center',
        width: 32
    },
    dot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotText: {
        color: '#fff',
        fontSize: 12
    },
    line: {
        width: 2,
        flex: 1,
        minHeight: 18
    },
    labelCol: {
        flex: 1,
        paddingLeft: 10,
        paddingBottom: 14,
        justifyContent: 'center'
    },
    labelId: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '600'
    },
    done: {
        color: '#22C55E'
    },
    current: {
        color: '#F59E0B'
    },
    status: {
        color: '#6B7280',
        fontSize: 11,
        marginTop: 2
    },
});

export default ProgressStep;