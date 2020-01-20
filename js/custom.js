/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits


******************************/

$(document).ready(function()
{
	"use strict";

	/* 

	1. Vars and Inits

	*/

	var 
	targetLevel = 63,
	targetDefense = 0,
	skillDiff = 0,
	hitChance,
	crit = 0,
	weaponSkill = 0,
	dw,
	defense = 315,
	miss = 0,
	dodge = 5,
	parry = 14,
	glance = 40,
	glanceRed = 0,
	block = 5,
	total = 100,
	hit = 100,
	btn = $('.btn'),
	table = $('.table');
	btn.on('click', calculate);	

	function calculate()
	{
		resetDefaults();
		targetDefense = targetLevel * 5; //315 for level 63 mobs
		hitChance = $('#input_hit').val();
		crit = parseInt($('#input_crit').val());
		if($('#dw').prop("checked"))
		{
			dw = true;
		}
		else
		{
			dw = false;
		}
		weaponSkill = $('#wskill').val();
		skillDiff = targetDefense - weaponSkill;
		miss = getMiss() - hitChance;
		miss = round(miss);
		var dodgeFinal = dodge + (skillDiff * 0.1);
		block = block + ((targetLevel - 60) * 0.5);
		glanceRed = 100 - (getGlanceRed() * 100);
		total = total - miss - dodgeFinal - glance;
		var critFinal = parseFloat(getCritFinal());
		var hitFinal = round(total - critFinal);
		var critOverCap = 0;
		total = round(total);
		if(hitFinal < 0)
		{
			hitFinal = 0;
		}
		if(parseFloat(critFinal) > parseFloat(total))
		{
			critOverCap = round(critFinal - total);
			critFinal = total + '(' + critOverCap + '% crit is over the cap)';
		}
		
		// $('.crit_cap').text(hitFinal);
		var result = 
			'<div>Miss: '+ miss +'</div>'+
			'<div>Dodge: '+ dodgeFinal +'</div>'+
			'<div>Glancing Chance: '+ glance +'</div>'+
			'<div>Glancing Reduction: '+ glanceRed +'%</div>'+
			'<div>Crit: '+ critFinal +'</div>'+
			'<div>Crit cap (white): '+ total +'</div>'+
			'<div>Hit: '+ hitFinal +'%</div>';
		table.children().remove();
		table.append(result);
	}

	function round(x)
	{
		var returnValue;

		returnValue = parseFloat(x.toString().substring(0, x.toString().indexOf(".") + 3));

		return returnValue;
	}

	function resetDefaults()
	{
		targetDefense = 0;
		crit = 0;
		weaponSkill = 0;
		skillDiff = 0;
		miss = 0;
		block = 5;
		glanceRed = 0;
		total = 100;
	}

	function getCritFinal()
	{
		var critTemp = (crit + ((300 - (targetLevel * 5)) * 0.2)) - 1.8;

		// A flat 1.8% reduction to your crit chance gained from auras. Auras in this context are talents
		// such as Cruelty or Axe Specialization, gear that directly gives crit % through Equip: effects,
		// buffs that increase you crit chance like Songflower Serenade or Leader of the Pack, and
		// consumables such as Elixir of the Mongoose. It does not include crit gained indirectly through
		// Agility, neither base Agility or Agility from gear.
		// var critOverCap = 0;
		
		// if(parseFloat(critTemp) > parseFloat(total))
		// {
		// 	critOverCap = critTemp - total;
		// 	critTemp = total + '(' + critOverCap + '% crit is over the cap)';
		// }
		return critTemp;
	}

	function getMiss()
	{
		var returnValue;

		if((defense - weaponSkill) < 11)
		{
			returnValue = 5 + ((targetLevel * 5) - weaponSkill) * 0.1;
		}
		else
		{
			returnValue = 5 + ((targetLevel * 5) - weaponSkill) * 0.2;
		}

		if(dw)
		{
			//DualWieldMissChance = NormalMissChance * 0.8 + 20%
			returnValue = (returnValue * 0.8) + 20;
		}

		return returnValue;
	}

	function getGlanceRed()
	{
		var returnValue;

		//1.3 - 0.05*(defense-skill) capped at 0.91
		//1.2 - 0.03*(defense-skill) min of 0.2 and capped at 0.99
		var glanceRedMin = Math.min((1.3 - (0.05 * skillDiff)), 0.91);
		var glanceRedMax = Math.min((1.2 - (0.03 * skillDiff)), 0.99);
		if(glanceRedMax < 0.2)
		{
			glanceRedMax = 0.2;
		}
		returnValue = (glanceRedMin + glanceRedMax) / 2;

		return returnValue;
	}

});