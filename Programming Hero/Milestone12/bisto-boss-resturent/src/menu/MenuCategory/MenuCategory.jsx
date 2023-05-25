import React from 'react';
import MenuItem from '../../page/Shared/MenuItem/MenuItem';
import Cover from '../../page/Shared/Cover/Cover';

const MenuCategory = ({ items, title, coverImg }) => {
    return (
        <div>
            {
                title && <Cover img={coverImg} title={title}></Cover>
            }
            <div className='grid md:grid-cols-2 gap-10 my-10'>
                {
                    items.map(item => <MenuItem
                        key={item._id} item={item}
                    ></MenuItem>)
                }

            </div>
        </div>
    );
};

export default MenuCategory;