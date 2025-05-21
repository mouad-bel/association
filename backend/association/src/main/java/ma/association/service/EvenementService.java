package ma.association.service;

import ma.association.model.Evenement;
import ma.association.model.User;
import ma.association.repository.EvenementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvenementService {

    @Autowired
    private EvenementRepository evenementRepository;


    public List<Evenement> getAllEvenements() {
        return evenementRepository.findAll();
    }


    public Evenement createEvenement(Evenement evenement) {
        return evenementRepository.save(evenement);
    }

    public Evenement getEvenementById(Long id) {
        return evenementRepository.findById(id).orElse(null);
    }

    public boolean deleteEvenement(Long id) {
        if (!evenementRepository.existsById(id)) {
            return false;
        }
        evenementRepository.deleteById(id);
        return true;
    }

    public Evenement updateEvenement(Evenement evenement) {
        return evenementRepository.save(evenement);
    }
}
