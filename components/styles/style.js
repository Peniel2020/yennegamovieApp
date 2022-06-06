import { StyleSheet } from 'react-native';
import { normalize } from '../Views/views';

const allStyles = StyleSheet.create({
    homeBody: {
        margin: 0,
        padding: 0,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    flexColumn: {
        flexDirection: 'column',
    },
    flexRow: {
        flexDirection: 'row',
    },
    justifySpaceAround: {
        justifyContent: 'space-around',
    },
    justifySpaceBetween: {
        justifyContent: 'space-between',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    catHeader: {
        height: 20,
        color: 'white',
        backgroundColor: 'black'
    },
    posterImgUnfocusedShadow: {
        width: normalize(45),
        height: normalize(55),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        // elevation: 2,
        // marginRight: 20,
        overlayColor: 'transparent',
    },
    posterImgFocusedShadow: {
        width: normalize(55),
        height: normalize(65),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        // elevation: 10,
        // margin: 20,
        overlayColor: 'transparent',
        borderWidth: normalize(2),
        borderColor: '#f5bb47',
        opacity: 1
    },
    posterUnfocusedShadow: {
        overlayColor: 'transparent',
        opacity: 1,
        marginRight: normalize(8),
    },
    posterFocusedShadow: {
        overlayColor: 'transparent',
        opacity: 1,
        marginRight: normalize(8),
    },
    posterTouchUnfocusedShadow:{
        overlayColor: 'transparent',
        opacity: 1
    },
    catTouchFocusedShadow:{
        // borderColor: '#f5bb47',
        // borderWidth: normalize(1.5),
        backgroundColor: 'black', color: 'white', paddingHorizontal:normalize(5), paddingTop:normalize(2), paddingBottom:normalize(2), borderRadius: normalize(2)
    },
    catTouchUnfocusedShadow:{
        // borderColor: 'black',
        // borderWidth: normalize(1.5),
        backgroundColor: 'black', color: 'white', paddingHorizontal:normalize(5), paddingTop:normalize(2), paddingBottom:normalize(2), borderRadius: normalize(2)
    },
    FocusedBtn: {
        borderWidth: 3,
        backgroundColor: '#d45016',
        height: normalize(16),
        padding: 5,
        width: normalize(40),
        borderRadius: 4,
        color: 'white',
        textAlign: 'center',
        paddingTop: 7
        
    },
    UnFocusedBtn: {
        borderWidth: 1,
        backgroundColor: '#d45016',
        height: normalize(16),
        width: normalize(40),
        padding: 5,
        borderRadius: 2,
        color: 'white',
        textAlign: 'center',
        paddingTop: 7
    },
    logo: {
        width: normalize(45),
        height: normalize(25),
        borderRadius: 4,
    },
    deviceValidationBtn: {
        borderWidth: 3,
        backgroundColor: '#d45016',
        // height: normalize(25),
        padding: normalize(4),
        width: normalize(50),
        borderRadius: normalize(2),
        color: 'white',
        textAlign: 'center',
        paddingTop: normalize(5),
        margin: 'auto'
        
    },
});

const padding = (a, b, c, d) => {
    return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

export default { allStyles, padding };