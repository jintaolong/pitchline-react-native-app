import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#6366F1',
    secondary: '#3B82F6',
    // background: '#e0f2fe',
    // border: '#38bdf8',
    backgroundShades: {
        // light: '#f0f9ff',
        extraLight: '#f5f5f5',
        light: '#E5E7EB',
        dark: '#bae6fd',
    }
}

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundShades.extraLight,
        // padding: 16,
        // borderRadius: 12,
        // marginVertical: 8,
    },
    
    header: {
        backgroundColor: '#ffffff'
    },
    title: {
        fontSize: 18,
        // fontWeight: '700',
        color: colors.primary,
        marginBottom: 8,
        marginTop: 0,
        alignSelf: 'flex-start',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.secondary,
        marginBottom: 6,
        marginTop: 2,
    },
    text: {
        fontSize: 16,
        color: '#222',
        marginBottom: 4,
    },
    footNotes: { 
        fontSize: 10, 
        color: '#6B7280', 
        textAlign: 'right', 
        marginTop: 8 
    },
    emptyListContainer: {
        // flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 20,
    },
    emptyListText: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});

