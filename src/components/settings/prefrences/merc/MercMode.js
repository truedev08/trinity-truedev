import React, { useState } from 'react';
import './MercMode.css'
import { crypto } from '../../../../helpers-functions/cryptoCurrencies';
import Checkbox from '../../../helpers/checkbox/Checkbox';
import Modal from '../../../helpers/modal';

const MercMode = () => {
    const [value, setValue] = useState(false);
   return( 
        <div id="merc">
                <div className="grid-container">
                    <div className="iconFlo">
                        <img src={crypto.flo.icon} alt={crypto.flo.name} />
                        <div>
                        FLO
                        </div>
                    </div>
                    <div className="iconRvn">
                    <img src={crypto.raven.icon} alt={crypto.raven.name} />
                        <div>RVN</div>
                    </div>
                    <div className="header-a">
                        <h3>
                        Using these rental markets:
                        </h3>
                        <p>
                        MiningRigRentals.com
                        </p>
                        <p>
                        NiceHash.com
                        </p>
                    </div>
                    <div className="item-1">
                        <>
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                        </>
                    </div>
                    <div className="item-2">
                        <>
                        <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                        </>
                    </div>
                    
                    <div className="header-b">
                        <h3>
                        Using these mining pools:
                        </h3>
                        <p>
                        Alexandria.io/pool
                        </p>
                        <p>
                        Nanopool
                        </p>
                        <p>
                        MediciLandGov
                        </p>
                        <p>
                        <a href="#">Add New Pool</a>
                        </p>
                    </div>
                    <div className="item-3">
                        <>
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                        </>
                    </div>
                    <div className="item-4">
                        <>
                        <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                        </>
                    </div>
                    <span>
                    
                    </span>
                    <div className="header-c">
                        <h3>
                        Trade on these exchanges:
                        </h3>
                        <p>
                        Bittrex.com
                        </p>
                        <p>
                        Tokok.com
                        </p>
                        <p>
                        Binance.com
                        </p>
                    </div>
                    <div className="item-5">
                        <>
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                        </>
                    </div>
                    <div className="item-6">
                        <>
                        <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                          />
                         <Checkbox
                            isOn={value}
                            handleToggle={() => setValue(!value)}
                            isDisabled={true}
                          />
                        </>
                    </div>
                </div>
            <div>
            </div>
        </div>)
}

const Settings = ({handleClick, handleSave}) => {

  return ( <Modal
    classname={'merc-modal'}
    handleClick={handleClick}
    handleSubmit={handleSave}
    // title={}
    sendButtonTitle={<i className="fas fa-unlock"></i>}
    submitType={'submit'}
    modalBody={
        <>
            <MercMode />
        </>
    }
    footer={
      <div className="deposit-footer">
      <div className="deposit-footer-card">
      </div>
      </div>
          }
      submitType={'submit'}
      sendButtonTitle={`Save`}
      />
)}

export default Settings;