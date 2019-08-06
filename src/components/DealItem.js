import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {priceDisplay} from '../util';

export default class DealItem extends Component {
    static propTypes = {
        deal: PropTypes.object.isRequired,
        onPress: PropTypes.func.isRequired,
    };

    handlePress = () => {
        this.props.onPress(this.props.deal.key);
    };

    render() {
        const {deal} = this.props;
        return (
            <TouchableOpacity style={styles.deal} onPress={this.handlePress}>
                <Image 
                    source={{uri: deal.media[0]}}
                    style={styles.image}
                />
                <View style={styles.info}>
                    <Text style={styles.title}>{deal.title}</Text>
                    <View style={styles.footer}>
                        <Text>{deal.cause.name}</Text>
                        <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    deal: {
        marginHorizontal: 12,
        marginTop: 12,
    },
    info: {
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#bbb',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 5,
    },
    price: {
        flex: 1,
        textAlign: 'right',
    },
    footer: {
        flexDirection: 'row',
    },
});