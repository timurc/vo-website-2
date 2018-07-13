import React from 'react';
import style from './style.module.less';
import classnames from 'classnames';

import KisteBody from './kiste_ohne_arme_s.gif';
import Oberarm from './kiste_oberarm.gif';
import Unterarm from './kiste_unterarm.gif';
import Schraube from './schraube.gif';

function Kiste({ raiseArm, className, containerStyle }) {
    return (
        <div
            style={containerStyle}
            className={classnames(className, style.container, {
                [style.container__raise_mobile]: raiseArm !== undefined,
            })}
        >
            <div className={style.kiste}>
                <div className={style.body} style={{ backgroundImage: `url(${KisteBody})` }} />
                <div className={style.schraube}>
                    <div className={style.schraube_inner} style={{ backgroundImage: `url(${Schraube})` }} />
                </div>
                <div className={classnames(style.arm_container, style.arm_container_l)}>
                    <div
                        style={{ backgroundImage: `url(${Oberarm})` }}
                        className={classnames(style.arm, style.arm_l, { [style.arm__raise]: raiseArm === 'L' })}
                    >
                        <div
                            className={classnames(style.arm_l_lower, style.arm_lower)}
                            style={{ backgroundImage: `url(${Unterarm})` }}
                        />
                    </div>
                </div>
                <div className={classnames(style.arm_container, style.arm_container_r)}>
                    <div
                        style={{ backgroundImage: `url(${Oberarm})` }}
                        className={classnames(style.arm, style.arm_r, {
                            [style.arm__raise]: raiseArm === 'R',
                            [style.arm__raise_mobile]: raiseArm !== undefined,
                        })}
                    >
                        <div
                            className={classnames(style.arm_l_lower, style.arm_lower)}
                            style={{ backgroundImage: `url(${Unterarm})` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Kiste;
