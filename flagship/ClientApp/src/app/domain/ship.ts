import { Faction } from "./faction";
import { Size } from "./size";
import { DefenseToken } from "./defenseToken";
import { UpgradeType } from "./upgradeType";
import { UpgradeSlot } from "./upgradeSlot";
import { Armament } from "./armament";
import { ShipClass } from "./shipClass";
import { Upgrade } from "./upgrade";
import { Fleet } from "./fleet";

export class Ship {
  name: string;
  faction: Faction;
  size: Size;
  public fleet: Fleet;

  hull: number;
  command: number;
  squadron: number;
  engineering: number;
  points: number;

  frontShields: number;
  leftShields: number;
  rightShields: number;
  rearShields: number;
  defenseTokens: DefenseToken[];

  //upgradeSlots: UpgradeType[];
  //upgrades: {[type in UpgradeType]: Upgrade[]};
  upgradeSlots: UpgradeSlot[];

  antiSquadronArmament: Armament;
  frontArmament: Armament;
  leftArmament: Armament;
  rightArmament: Armament;
  rearArmament: Armament;

  constructor(name: string, faction: Faction, size: Size, shipClass: ShipClass, hull: number, command: number, 
    squadron: number, engineering: number, points: number, defenseTokens: DefenseToken[], 
    frontShields: number, leftShields: number, rightShields: number, rearShields: number,
    antiSquadronArmament: Armament, frontArmament: Armament, leftArmament: Armament, rightArmament: Armament, rearArmament: Armament,
    upgradeSlots: UpgradeSlot[]) {
      this.name = name;
      this.faction = faction;
      this.command = command;
      this.squadron = squadron;
      this.engineering = engineering;
      this.hull = hull;
      this.size = size;
      this.points = points;
      this.defenseTokens = defenseTokens;
      this.upgradeSlots = upgradeSlots;
      this.frontShields = frontShields;
      this.leftShields = leftShields;
      this.rightShields = rightShields;
      this.rearShields = rearShields;
      this.antiSquadronArmament = antiSquadronArmament;
      this.frontArmament = frontArmament;
      this.leftArmament = leftArmament;
      this.rightArmament = rightArmament;
      this.rearArmament = rearArmament;
  }

  currentPointsFromUpgrades(): number {
    let points = 0;
    for (const upgradeSlot of this.upgradeSlots) {
      if (upgradeSlot.isEnabled && upgradeSlot.upgrade) {
        points += upgradeSlot.upgrade.points;
      }
    }
    return points;
  }

  currentPoints(): number {
    let points = this.points;
    points = points + this.currentPointsFromUpgrades();

    return points;
  }

  canEquipUpgrade(upgrade: Upgrade): boolean {
    // Can't equip if upgrade doesn't agree
    if (!upgrade.canEquipToShip(this)) {
      return false;
    }
    
    // Can't equip if fleet doesn't agree
    if (this.fleet != null && !this.fleet.canEquipUpgrade(this, upgrade)) {
      return false;
    }
    
    return true;
  }

  equipUpgrade(upgrade: Upgrade): void {
    if (!this.canEquipUpgrade(upgrade)) {
      console.log('Cannot equip upgrade.');
      return;
    }

    const availableSlot = this.upgradeSlots.find((u: UpgradeSlot) => u.isEnabled && u.type === upgrade.type && !u.isFilled());
    availableSlot.equipUpgrade(upgrade, this);

    
  }
}
