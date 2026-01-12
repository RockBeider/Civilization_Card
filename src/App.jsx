import { useState, useEffect, useCallback } from 'react';
import {
    User, Hammer, BrainCircuit, Pickaxe, Scroll, Zap, Rocket,
    FlaskConical, Wheat, Shield, Star, Globe, Volume2, VolumeX,
    Crown, Save, RotateCcw, Trash, Home, X, FilePlus, Flame,
    Maximize, Minimize, ArrowUp, Wrench, Play, Pause, FastForward,
    ChevronDown, Check, Diamond
} from './components/ui/Icons';
import { ResourceCard, ActionButton, SectionTitle } from './components/ui/BasicComponents';
import { SaveLoadModal } from './components/ui/SaveLoadModal';
import { UpgradeModal } from './components/ui/UpgradeModal';
import { RaceSelectionScreen } from './components/screens/RaceSelectionScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import { useSound } from './hooks/useSound';
import {
    RACES, TECH_TREE, BUILDINGS, DISASTERS_BY_AGE, WONDERS,
    SLOT_PREFIX, SLOT_COUNT, AGES
} from './data/constants';

function App() {
    const [gameState, setGameState] = useState('selection');
    const [selectedRace, setSelectedRace] = useState(null);
    const { initAudio, playSound, isMuted, toggleMute } = useSound();
    const [resources, setResources] = useState({ food: 0, prod: 0, sci: 0 });
    const [buildings, setBuildings] = useState({ farm: 0, mine: 0, lab: 0 });
    const [buildingLevels, setBuildingLevels] = useState({ farm: 0, mine: 0, lab: 0 });
    const [currentAge, setCurrentAge] = useState(0);
    const [researched, setResearched] = useState([]);
    const [logs, setLogs] = useState(["문명의 여명이 밝았습니다."]);
    const [multipliers, setMultipliers] = useState({ food: 1, prod: 1, sci: 1 });
    const [hasWonder, setHasWonder] = useState(false);
    const [disasterActive, setDisasterActive] = useState(false);
    const [currentSlot, setCurrentSlot] = useState(null);
    const [slotsData, setSlotsData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('save');
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [gameSpeed, setGameSpeed] = useState(1);
    const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

    const refreshSlots = () => {
        const loaded = {};
        for (let i = 1; i <= SLOT_COUNT; i++) {
            const saved = localStorage.getItem(SLOT_PREFIX + i);
            if (saved) loaded[i] = JSON.parse(saved);
        }
        setSlotsData(loaded);
    };

    useEffect(() => { refreshSlots(); }, []);

    // Cheat code
    useEffect(() => {
        window.cheat = (food = 0, prod = 0, sci = 0) => {
            setResources(prev => ({
                food: prev.food + food,
                prod: prev.prod + prod,
                sci: prev.sci + sci
            }));
            console.log(`Resources Added: Food +${food}, Prod +${prod}, Sci +${sci}`);
        };
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    const triggerDisaster = useCallback(() => {
        const possibleDisasters = DISASTERS_BY_AGE[currentAge];
        if (!possibleDisasters || possibleDisasters.length === 0) return;

        const disaster = possibleDisasters[Math.floor(Math.random() * possibleDisasters.length)];
        let msg = `[재해] ${disaster.desc}`;

        setDisasterActive(true);
        playSound('disaster');
        setTimeout(() => setDisasterActive(false), 500);

        if (disaster.type === 'resource') {
            setResources(prev => ({
                ...prev,
                [disaster.target]: Math.max(0, Math.floor(prev[disaster.target] * (1 - disaster.ratio)))
            }));
        } else if (disaster.type === 'building') {
            setBuildings(prev => ({
                ...prev,
                [disaster.target]: Math.max(0, prev[disaster.target] - disaster.count)
            }));
        } else if (disaster.type === 'building_all') {
            setBuildings(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(k => next[k] = Math.max(0, next[k] - 1));
                return next;
            });
        }

        setLogs(prev => [msg, ...prev].slice(0, 50));
    }, [currentAge, playSound]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        if (gameSpeed === 0) return; // Paused

        const intervalTime = 1000 / gameSpeed;

        const interval = setInterval(() => {
            setResources(prev => {
                const raceBonus = selectedRace.bonus;
                const getEff = (type) => 1 + (buildingLevels[type] || 0) * 0.2;

                const autoFood = buildings.farm * 1 * raceBonus.food * multipliers.food * getEff('farm');
                const autoProd = buildings.mine * 1 * raceBonus.prod * multipliers.prod * getEff('mine');
                const autoSci = buildings.lab * 1 * raceBonus.sci * multipliers.sci * getEff('lab');
                return {
                    food: prev.food + autoFood,
                    prod: prev.prod + autoProd,
                    sci: prev.sci + autoSci
                };
            });

            if (Math.random() < 0.005) {
                triggerDisaster();
            }

        }, intervalTime);
        return () => clearInterval(interval);
    }, [gameState, buildings, buildingLevels, selectedRace, multipliers, triggerDisaster, gameSpeed]);

    useEffect(() => {
        if (gameState !== 'playing' || !currentSlot) return;
        const saveInterval = setInterval(() => {
            saveToSlot(currentSlot, true);
        }, 30000);
        return () => clearInterval(saveInterval);
    }, [gameState, currentSlot, selectedRace, resources, buildings, buildingLevels, currentAge, researched, multipliers, hasWonder, logs]);

    const addLog = (msg) => {
        setLogs(prev => [msg, ...prev].slice(0, 50));
    };

    const saveToSlot = (slotId, silent = false) => {
        if (!selectedRace) return;
        const data = {
            selectedRaceId: selectedRace.id,
            resources,
            buildings,
            buildingLevels,
            currentAge,
            researched,
            multipliers,
            hasWonder,
            logs,
            timestamp: Date.now()
        };
        localStorage.setItem(SLOT_PREFIX + slotId, JSON.stringify(data));

        if (!silent) {
            addLog(`게임이 슬롯 ${slotId}번에 저장되었습니다.`);
            playSound('build');
            refreshSlots();
            setCurrentSlot(slotId);
            setIsModalOpen(false);
        }
    };

    const loadFromSlot = (slotId) => {
        const data = slotsData[slotId];
        if (!data) return;

        const race = RACES.find(r => r.id === data.selectedRaceId);
        if (race) setSelectedRace(race);

        setResources(data.resources);
        setBuildings({ ...{ farm: 0, mine: 0, lab: 0 }, ...data.buildings });
        setBuildingLevels({ ...{ farm: 0, mine: 0, lab: 0 }, ...data.buildingLevels });
        setCurrentAge(data.currentAge);
        setResearched(data.researched);
        setMultipliers(data.multipliers);
        setHasWonder(data.hasWonder);
        setLogs(data.logs);

        setCurrentSlot(slotId);
        setGameState('playing');
        initAudio();
        setIsModalOpen(false);
    };

    const goHome = () => {
        if (currentSlot) saveToSlot(currentSlot, true);
        setGameState('selection');
        setCurrentSlot(null);
    };

    const startGame = (race) => {
        initAudio();
        setSelectedRace(race);
        setGameState('playing');
        setCurrentSlot(null);
        setResources({ food: 0, prod: 0, sci: 0 });
        setBuildings({ farm: 0, mine: 0, lab: 0 });
        setBuildingLevels({ farm: 0, mine: 0, lab: 0 });
        setCurrentAge(0);
        setResearched([]);
        setMultipliers({ food: 1, prod: 1, sci: 1 });
        setHasWonder(false);
        setLogs([`${race.name} 종족으로 역사를 시작합니다.`]);
        playSound('research');
    };

    const openSaveModal = () => {
        refreshSlots();
        setModalMode('save');
        setIsModalOpen(true);
    };

    const openLoadModal = () => {
        refreshSlots();
        setModalMode('load');
        setIsModalOpen(true);
    };

    const handleSlotAction = (slotId) => {
        if (modalMode === 'save') {
            if (slotsData[slotId] && !confirm(`슬롯 ${slotId}번에 덮어쓰시겠습니까?`)) return;
            saveToSlot(slotId);
        } else {
            if (!slotsData[slotId]) return;
            loadFromSlot(slotId);
        }
    };

    const calculateClickValue = (type) => {
        if (!selectedRace) return 1;
        const bonus = selectedRace.bonus[type] || 1;
        const mult = multipliers[type] || 1;
        const baseAmount = 1 + (currentAge * 1);
        return baseAmount * bonus * mult;
    };

    const gather = (type) => {
        playSound('click');
        setResources(prev => {
            const amount = calculateClickValue(type);
            return { ...prev, [type]: prev[type] + amount };
        });
    };

    const buyBuilding = (type) => {
        const building = BUILDINGS[type];
        const count = buildings[type];
        const costFood = Math.floor(building.cost.food * Math.pow(1.15, count));
        const costProd = Math.floor(building.cost.prod * Math.pow(1.15, count));
        const costSci = Math.floor(building.cost.sci * Math.pow(1.15, count));

        if (resources.food >= costFood && resources.prod >= costProd && resources.sci >= costSci) {
            playSound('build');
            setResources(prev => ({
                ...prev,
                food: prev.food - costFood,
                prod: prev.prod - costProd,
                sci: prev.sci - costSci
            }));

            const newCount = buildings[type] + 1;
            setBuildings(prev => ({ ...prev, [type]: newCount }));
            addLog(`${building.name} 건설 완료!`);

            // Check for upgrade unlock
            if (type === 'lab' && newCount === 10) {
                setTimeout(() => {
                    addLog("시설 기술 강화가 해금되었습니다!");
                    playSound('age'); // Use a distinct sound if available, 'age' is impactful
                }, 500); // Slight delay for emphasis
            }
        } else {
            playSound('error');
            addLog("자원이 부족합니다.");
        }
    };

    const upgradeBuilding = (type) => {
        const currentLevel = buildingLevels[type] || 0;
        if (currentLevel >= 10) return;

        const costSci = getUpgradeCost(type);

        if (resources.sci >= costSci) {
            playSound('upgrade');
            setResources(prev => ({ ...prev, sci: prev.sci - costSci }));
            setBuildingLevels(prev => ({ ...prev, [type]: currentLevel + 1 }));
            addLog(`${BUILDINGS[type].name} 기술 강화 완료 (Lv.${currentLevel + 1})`);
        } else {
            playSound('error');
            addLog("과학력이 부족합니다.");
        }
    };

    const buildWonder = () => {
        if (hasWonder) return;
        const wonder = WONDERS[selectedRace.id];
        const cost = wonder.cost;

        if (resources.food >= cost.food && resources.prod >= cost.prod && resources.sci >= cost.sci) {
            playSound('wonder');
            setResources(prev => ({
                food: prev.food - cost.food,
                prod: prev.prod - cost.prod,
                sci: prev.sci - cost.sci
            }));
            setHasWonder(true);
            addLog(`위대한 업적! [${wonder.name}] 건설 완료!`);

            setMultipliers(prev => {
                if (wonder.effect === 'all_boost') return { food: prev.food * 1.5, prod: prev.prod * 1.5, sci: prev.sci * 1.5 };
                if (wonder.effect === 'prod_boost') return { ...prev, prod: prev.prod * 2.0 };
                if (wonder.effect === 'sci_boost') return { ...prev, sci: prev.sci * 2.0 };
                return prev;
            });
        } else {
            playSound('error');
            addLog("불가사의 건설 자원이 부족합니다.");
        }
    };

    const research = (tech) => {
        if (resources.sci >= tech.cost) {
            setResources(prev => ({ ...prev, sci: prev.sci - tech.cost }));
            setResearched(prev => [...prev, tech.id]);
            addLog(`[기술] ${tech.name} 연구 완료!`);

            if (tech.unlocks) {
                if (tech.unlocks === 'win') {
                    setGameState('victory');
                    playSound('age');
                } else {
                    const nextAgeIdx = AGES.findIndex(a =>
                        (tech.unlocks === 'ancient' && a.id === 1) ||
                        (tech.unlocks === 'medieval' && a.id === 2) ||
                        (tech.unlocks === 'industrial' && a.id === 3) ||
                        (tech.unlocks === 'modern' && a.id === 4) ||
                        (tech.unlocks === 'space' && a.id === 5)
                    );
                    if (nextAgeIdx !== -1) {
                        setCurrentAge(nextAgeIdx);
                        addLog(`${AGES[nextAgeIdx].name}로 진입했습니다!`);
                        playSound('age');
                    } else {
                        playSound('research');
                    }
                }
            } else {
                playSound('research');
            }

            if (tech.effect) {
                setMultipliers(prev => {
                    if (tech.effect === 'food_eff') return { ...prev, food: prev.food * 2 };
                    if (tech.effect === 'prod_eff') return { ...prev, prod: prev.prod * 2 };
                    if (tech.effect === 'sci_eff') return { ...prev, sci: prev.sci * 2 };
                    if (tech.effect === 'sci_eff_3x') return { ...prev, sci: prev.sci * 3 };
                    if (tech.effect === 'all_eff') return { food: prev.food * 1.5, prod: prev.prod * 1.5, sci: prev.sci * 1.5 };
                    return prev;
                });
            }
        } else {
            playSound('error');
            addLog("과학력이 부족합니다.");
        }
    };

    const getBuildingCost = (type) => {
        const base = BUILDINGS[type].cost;
        const count = buildings[type];
        return {
            food: Math.floor(base.food * Math.pow(1.15, count)),
            prod: Math.floor(base.prod * Math.pow(1.15, count)),
            sci: Math.floor(base.sci * Math.pow(1.15, count))
        };
    };

    const getUpgradeCost = (type) => {
        const currentLevel = buildingLevels[type] || 0;
        return Math.floor(200 * Math.pow(1.1, currentLevel));
    }


    if (gameState === 'selection') {
        return (
            <>
                <RaceSelectionScreen onSelect={startGame} onLoad={openLoadModal} />
                {isModalOpen && <SaveLoadModal mode={modalMode} slots={slotsData} onClose={() => setIsModalOpen(false)} onAction={handleSlotAction} />}
            </>
        );
    }

    if (gameState === 'victory') {
        return <VictoryScreen onRestart={goHome} />;
    }

    return (
        <div className={`game-container ${disasterActive ? 'animate-shake disaster-flash' : ''}`}>
            {isModalOpen && <SaveLoadModal mode={modalMode} slots={slotsData} onClose={() => setIsModalOpen(false)} onAction={handleSlotAction} />}
            {isUpgradeModalOpen && <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} buildings={buildings} buildingLevels={buildingLevels} resources={resources} onUpgrade={upgradeBuilding} getUpgradeCost={getUpgradeCost} />}

            {/* 상단 헤더 */}
            <header
                className="game-header header-bg"
                style={{ backgroundImage: `url(${AGES[currentAge].img})` }}
            >
                <div className="header-overlay"></div>

                {/* 컨트롤 버튼 그룹 */}
                <div className="control-buttons">
                    <div className="speed-dropdown-container">
                        <button
                            onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                            className={`control-btn speed-toggle ${isSpeedMenuOpen ? 'active' : ''}`}
                            title="게임 속도 조절"
                        >
                            {gameSpeed === 0 ? <Pause size={18} /> : <span>{gameSpeed}x</span>}
                            <ChevronDown size={14} className={`chevron ${isSpeedMenuOpen ? 'rotate' : ''}`} />
                        </button>

                        {isSpeedMenuOpen && (
                            <div className="speed-menu animate-fade-in">
                                <div onClick={() => { setGameSpeed(0); setIsSpeedMenuOpen(false); }} className={`speed-item ${gameSpeed === 0 ? 'selected' : ''}`}>
                                    <Pause size={14} className="mr-2" /> 정지
                                    {gameSpeed === 0 && <Check size={14} className="check-icon" />}
                                </div>
                                <div onClick={() => { setGameSpeed(1); setIsSpeedMenuOpen(false); }} className={`speed-item ${gameSpeed === 1 ? 'selected' : ''}`}>
                                    <span>1x</span> 보통
                                    {gameSpeed === 1 && <Check size={14} className="check-icon" />}
                                </div>
                                <div onClick={() => { setGameSpeed(2); setIsSpeedMenuOpen(false); }} className={`speed-item ${gameSpeed === 2 ? 'selected' : ''}`}>
                                    <span>2x</span> 빠름
                                    {gameSpeed === 2 && <Check size={14} className="check-icon" />}
                                </div>
                                <div onClick={() => { setGameSpeed(5); setIsSpeedMenuOpen(false); }} className={`speed-item ${gameSpeed === 5 ? 'selected' : ''}`}>
                                    <span>5x</span> 매우 빠름
                                    {gameSpeed === 5 && <Check size={14} className="check-icon" />}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="divider"></div>

                    <button onClick={toggleFullScreen} title={isFullScreen ? "전체화면 종료" : "전체화면"} className="control-btn hidden">
                        {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                    <button onClick={goHome} title="메인으로" className="control-btn">
                        <Home size={18} />
                    </button>
                    <button onClick={openSaveModal} title="저장하기" className="control-btn">
                        <Save size={18} />
                    </button>
                    <button onClick={toggleMute} title="음소거" className="control-btn">
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                </div>

                <div className="header-content">
                    <div className="header-top">
                        <div className="header-info">
                            <div className={`age-icon ${AGES[currentAge].color} overflow-hidden p-0`}>
                                <img src={selectedRace.img} alt={selectedRace.name} className="block w-full h-auto object-cover" />
                            </div>
                            <div>
                                <h1 className={`age-title ${AGES[currentAge].color}`}>{AGES[currentAge].name}</h1>
                                <p className="civ-info">
                                    {selectedRace.name} 문명
                                    <span className="info-badge">목표: 우주 진출</span>
                                    {currentSlot && <span className="slot-badge">슬롯 {currentSlot}</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="resource-bar">
                        <ResourceCard icon={<Wheat size={20} className="icon-text-yellow" />} label="식량" value={resources.food} rate={buildings.farm * selectedRace.bonus.food * multipliers.food * (1 + buildingLevels.farm * 0.3)} />
                        <ResourceCard icon={<Hammer size={20} className="icon-text-orange" />} label="생산력" value={resources.prod} rate={buildings.mine * selectedRace.bonus.prod * multipliers.prod * (1 + buildingLevels.mine * 0.3)} />
                        <ResourceCard icon={<FlaskConical size={20} className="icon-text-blue" />} label="과학" value={resources.sci} rate={buildings.lab * selectedRace.bonus.sci * multipliers.sci * (1 + buildingLevels.lab * 0.3)} />
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className="main-content">
                {/* 왼쪽 패널 */}
                <div className="panel-left">
                    <div className="panel-inner">
                        <SectionTitle title="기본 활동" />
                        <div className="action-grid">
                            <ActionButton
                                onClick={() => gather('food')}
                                icon={<Wheat size={18} />}
                                label="식량 채집"
                                desc={`+${Math.floor(calculateClickValue('food')).toLocaleString()} (클릭)`}
                                colorClass="btn-food"
                            />
                            <ActionButton
                                onClick={() => gather('prod')}
                                icon={<Pickaxe size={18} />}
                                label="자원 채굴"
                                desc={`+${Math.floor(calculateClickValue('prod')).toLocaleString()} (클릭)`}
                                colorClass="btn-prod"
                            />
                            <ActionButton
                                onClick={() => gather('sci')}
                                icon={<Scroll size={18} />}
                                label="자연 관찰"
                                desc={`+${Math.floor(calculateClickValue('sci')).toLocaleString()} (클릭)`}
                                colorClass="btn-sci"
                            />
                        </div>

                        <SectionTitle title="건물 건설" />
                        <div className="building-list">
                            {Object.keys(BUILDINGS).map(key => {
                                const cost = getBuildingCost(key);
                                const canAfford = resources.food >= cost.food && resources.prod >= cost.prod && resources.sci >= cost.sci;
                                const outputName = key === 'farm' ? '식량' : key === 'mine' ? '생산' : '과학';
                                const baseOutput = 1;
                                const bonusOutput = baseOutput * ((buildingLevels[key] || 0) * 0.3);

                                return (
                                    <div key={key} onClick={() => buyBuilding(key)}
                                        className={`building-card ${canAfford ? 'affordable' : 'unaffordable'}`}>
                                        <div className="building-info">
                                            <div className="building-name">
                                                {BUILDINGS[key].name} (Lv.{buildings[key]})
                                            </div>
                                            <div className="building-cost">
                                                비용:
                                                {cost.food > 0 && <span className="cost-food"> 🌾{cost.food.toLocaleString()}</span>}
                                                {cost.prod > 0 && <span className="cost-prod"> ⚒️{cost.prod.toLocaleString()}</span>}
                                                {cost.sci > 0 && <span className="cost-sci"> 🧪{cost.sci.toLocaleString()}</span>}
                                            </div>
                                        </div>
                                        <div className="building-output">
                                            <div className="output-value">
                                                +{baseOutput}
                                                {bonusOutput > 0 && <span className="output-bonus">(+{bonusOutput.toFixed(1)})</span>}
                                            </div>
                                            <div className="output-label">{outputName}/초 (개당)</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 업그레이드 버튼 - 연구소 10개 이상일 때 해금 */}
                        {buildings.lab >= 10 && (
                            <button onClick={() => setIsUpgradeModalOpen(true)} className="upgrade-btn">
                                <div className="flex items-center gap-3">
                                    <div className="upgrade-icon">
                                        <Wrench size={20} />
                                    </div>
                                    <div className="upgrade-info">
                                        <div className="upgrade-title">시설 기술 강화</div>
                                        <div className="upgrade-desc">건물 생산 효율 영구 증가</div>
                                    </div>
                                </div>
                                <ArrowUp size={16} className="upgrade-arrow" />
                            </button>
                        )}

                        <SectionTitle title="불가사의" />
                        {hasWonder ? (
                            <div className="wonder-card completed wonder-glow">
                                <div className="wonder-bg" style={{ backgroundImage: `url(${WONDERS[selectedRace.id].img})` }}></div>
                                <div className="wonder-overlay"></div>
                                <div className="wonder-content">
                                    <div className="wonder-header">
                                        <div className="wonder-title">{WONDERS[selectedRace.id].name}</div>
                                        <Crown size={20} className="wonder-icon" />
                                    </div>
                                    <div className="wonder-desc">
                                        <div className="wonder-status-badge">건설 완료</div>
                                        <div>{WONDERS[selectedRace.id].desc}</div>
                                    </div>
                                    <div className="wonder-effect-tag">✨ 영구 효과 적용 중</div>
                                </div>
                            </div>
                        ) : (
                            <div onClick={buildWonder}
                                className={`wonder-card ${resources.food >= WONDERS[selectedRace.id].cost.food && resources.prod >= WONDERS[selectedRace.id].cost.prod && resources.sci >= WONDERS[selectedRace.id].cost.sci ? 'affordable' : 'unaffordable'}`}>
                                <div className="wonder-bg" style={{ backgroundImage: `url(${WONDERS[selectedRace.id].img})` }}></div>
                                <div className="wonder-overlay"></div>
                                <div className="wonder-content">
                                    <div className="wonder-header">
                                        <div className="wonder-title">{WONDERS[selectedRace.id].name}</div>
                                        <Crown size={20} className="wonder-icon" />
                                    </div>
                                    <div className="wonder-desc">{WONDERS[selectedRace.id].desc}</div>
                                    <div className="wonder-costs">
                                        {WONDERS[selectedRace.id].cost.food > 0 && <div className={resources.food >= WONDERS[selectedRace.id].cost.food ? 'cost-item text-yellow' : 'cost-item text-red'}>🌾 {WONDERS[selectedRace.id].cost.food.toLocaleString()}</div>}
                                        {WONDERS[selectedRace.id].cost.prod > 0 && <div className={resources.prod >= WONDERS[selectedRace.id].cost.prod ? 'cost-item text-orange' : 'cost-item text-red'}>⚒️ {WONDERS[selectedRace.id].cost.prod.toLocaleString()}</div>}
                                        {WONDERS[selectedRace.id].cost.sci > 0 && <div className={resources.sci >= WONDERS[selectedRace.id].cost.sci ? 'cost-item text-blue' : 'cost-item text-red'}>🧪 {WONDERS[selectedRace.id].cost.sci.toLocaleString()}</div>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 중앙 패널 */}
                <div className="panel-center">
                    <div className="log-overlay"></div>
                    <div className="log-header">
                        <SectionTitle title="역사의 기록" />
                    </div>
                    <div className="log-content">
                        {logs.map((log, i) => (
                            <div key={i} className={`log-entry animate-fade-in ${log.includes('시대로') ? 'log-age' : ''}`}>
                                {!log.includes('시대로') && <span className="log-number">[{logs.length - i}]</span>}
                                <span className={`${log.includes('[재해]') ? 'log-disaster' : ''} ${log.includes('[기술]') ? 'log-tech' : ''}`}>
                                    {log}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 오른쪽 패널 */}
                <div className="panel-right">
                    <div className="panel-inner">
                        <SectionTitle title="기술 발전표" />
                        <div className="tech-list">
                            {TECH_TREE.map((tech) => {
                                const isResearched = researched.includes(tech.id);
                                const isAvailable = !isResearched && tech.ageReq <= currentAge;

                                // Logic for dependencies
                                let isLocked = false;
                                let missingReqs = [];

                                if (tech.reqTech) {
                                    const reqs = Array.isArray(tech.reqTech) ? tech.reqTech : [tech.reqTech];
                                    reqs.forEach(reqId => {
                                        if (!researched.includes(reqId)) {
                                            isLocked = true;
                                            const req = TECH_TREE.find(t => t.id === reqId);
                                            missingReqs.push(req ? req.name : reqId);
                                        }
                                    });
                                }

                                const canAfford = resources.sci >= tech.cost;

                                // Filter by race
                                if (tech.reqRace && tech.reqRace !== selectedRace.id) return null;

                                if (!isResearched && tech.ageReq > currentAge) return null;

                                return (
                                    <div key={tech.id}
                                        onClick={() => isAvailable && canAfford && !isLocked ? research(tech) : null}
                                        className={`tech-card ${isResearched ? 'researched' : 'available'} ${isLocked ? 'locked' : (!isResearched && canAfford ? 'affordable' : !isResearched ? 'unaffordable' : '')}`}
                                        style={tech.img ? { backgroundImage: `url(${tech.img})` } : {}}
                                    >
                                        <div className="tech-overlay"></div>
                                        <div className="tech-content-wrapper">
                                            <div className="tech-header">
                                                <h3 className={`tech-name ${isResearched ? 'researched' : 'available'}`}>{tech.name}</h3>
                                                {isResearched ? <Zap size={16} className="tech-icon researched" /> : <FlaskConical size={16} className="tech-icon available" />}
                                            </div>
                                            <p className="tech-desc">{tech.desc}</p>

                                            {!isResearched && isLocked && (
                                                <div className="tech-req">
                                                    🔒 필요: {missingReqs.join(', ')}
                                                </div>
                                            )}

                                            {!isResearched && !isLocked && (
                                                <div className={`tech-cost ${canAfford ? 'affordable' : 'unaffordable'}`}>
                                                    필요 과학: {tech.cost.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {researched.length === TECH_TREE.length && <div className="tech-complete-msg">모든 기술을 연구했습니다.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
